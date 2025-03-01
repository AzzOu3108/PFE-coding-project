const { projet, tache, projet_utilisateur, tache_projet, utilisateur, tache_utilisateur } = require("../models");
const { getProjectFilter, getUserInclude, getTaskInclude } = require('../services/projectService')

const getAllProjects = async (req, res) => {
    try {
      // Get the logged-in user's role and id
      const userRole = req.user.role;
      const userId = req.user.id;
  
      // Get the filters from the helper file
      const projectFilter = getProjectFilter(userRole, userId);
      const userInclude = getUserInclude(userRole, userId, utilisateur);
      const taskInclude = getTaskInclude(userRole, userId, tache, utilisateur);
  
      // Execute the query with the dynamic filters
      const projects = await projet.findAll({
        where: projectFilter,
        include: [
          userInclude,
          taskInclude,
        ],
      });
  
      // Map over the projects to add a computed 'equipe' field in each task.
      const Projets = projects.map(project => {
        const projObj = project.toJSON();
        projObj.taches = projObj.taches.map(task => ({
          ...task,
          equipe: task.utilisateurs ? task.utilisateurs.map(user => user.nom_complet) : []
        }));
        return projObj;
      });
  
      if (!projects.length) {
        return res.status(404).json({ message: "Aucun projet disponible." });
      }
  
      res.status(200).json({ Projets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur du serveur." });
    }
};


const getProjectsByRole = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        // Base include configuration (reused from getAllProjects)
        const baseIncludes = [
            {
                model: utilisateur,
                through: { attributes: [] },
                as: 'utilisateurs',
                attributes: ['nom_complet']
            },
            {
                model: tache,
                through: { attributes: [] },
                as: 'taches',
                attributes: ['titre', 'statut', 'date_de_debut_tache', 'date_de_fin_tache', 'poids'],
                include: [{
                    model: utilisateur,
                    through: { attributes: [] },
                    as: "utilisateurs",
                    attributes: ['nom_complet'],
                }],
            }
        ];

        let queryOptions = {
            include: baseIncludes
        };

        // Role-based filtering
        switch (user.role) {
            case 'administrateur':
            case 'directeur':
                // No additional filters - get all projects
                break;

            case 'chef de projet':
                queryOptions.where = { createur_id: user.id };
                queryOptions.include = baseIncludes.map(include => {
                    if (include.as === 'taches') {
                        return {
                            ...include,
                            where: { createur_id: user.id } // Only tasks they created
                        };
                    }
                    return include;
                });
                break;

            case 'utilisateur':
                queryOptions.include = baseIncludes.map(include => {
                    if (include.as === 'utilisateurs') {
                        return {
                            ...include,
                            where: { id: user.id },
                            required: true
                        };
                    }
                    if (include.as === 'taches') {
                        return {
                            ...include,
                            include: [{
                                ...include.include[0],
                                where: { id: user.id },
                                required: true
                            }]
                        };
                    }
                    return include;
                });
                break;

            default:
                return res.status(403).json({ message: "Accès non autorisé" });
        }

        const projects = await projet.findAll(queryOptions);

        // Transform results (reused from getAllProjects)
        const Projets = projects.map(project => ({
            ...project.toJSON(),
            taches: project.taches.map(task => ({
                ...task.toJSON(),
                equipe: task.utilisateurs.map(user => user.nom_complet),
                utilisateurs: undefined,
            }))
        }));

        if (!projects.length) {
            return res.status(404).json({ message: "Aucun projet trouvé" });
        }

        res.status(200).json({ Projets });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
};


const getProjectByName = async (req, res) => {
    const { nom_de_projet } = req.query;

    if (!nom_de_projet) {
        return res.status(400).json({ message: "Veuillez fournir un nom de projet." });
    }

    try {
        const project = await projet.findOne({
            where: { nom_de_projet },
            include: [
                {
                    model: tache,
                    through: { attributes: [] },
                    as: 'taches',
                    attributes: ['titre', 'statut', 'date_de_debut_tache', 'date_de_fin_tache', 'poids'],
                    include: [{
                        model: utilisateur,
                        through: { attributes: [] },
                        as: "utilisateurs", 
                        attributes: ['nom_complet']
                    }],
                },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Aucun projet correspondant." });
        }

       
        const Projet = {
            ...project.toJSON(),
            taches: project.taches.map(task => ({
                ...task.toJSON(),
                equipe: task.utilisateurs.map(user => user.nom_complet), 
                utilisateurs: undefined, 
            }))
        };

        res.status(200).json({ Projet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const createProject = async (req, res) => {
    
    const {
        function_de_projet,
        nom_de_projet,
        nom_programme,
        sponsor_de_programme,
        manager_de_projet,
        controle_des_couts,
        description,
        objective,
        date_de_debut,
        date_de_fin,
        buget_global,
    } = req.body;

    if (!nom_de_projet || 
        !function_de_projet || 
        !nom_programme ||
        !sponsor_de_programme ||
        !manager_de_projet ||  
        !description || 
        !objective || 
        !date_de_debut || 
        !date_de_fin || 
        !buget_global
    ) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    if (new Date(date_de_debut) >= new Date(date_de_fin)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        
        const existingProject = await projet.findOne({ where: { nom_de_projet } });
        if (existingProject) {
            return res.status(409).json({ message: "Ce projet existe déjà." });
        }

        const newProject = await projet.create({
            function_de_projet,
            nom_programme,
            sponsor_de_programme,
            manager_de_projet,
            nom_de_projet,
            controle_des_couts,
            description,
            objective,
            date_de_debut,
            date_de_fin,
            buget_global,
           
        });

        await projet_utilisateur.create({
            projet_id: newProject.id,
            utilisateur_id: req.user.id
        })

        res.status(201).json({ message: "Projet créé avec succès.", newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        return res.status(400).json({ message: "L'ID du projet est requis dans l'URL." });
    }

    try {
        const project = await projet.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        Object.assign(project, updateData);

        await project.save();

        res.status(200).json({ message: "Projet mis à jour avec succès.", project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

// TODO: Extracting req.userId from Token ki tlha9 l auth and Authorization
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const { utilisateur_id } = req.body;

    try {
        const userProject = await projet_utilisateur.findOne({
            where: {
                utilisateur_id: utilisateur_id,
                projet_id: id
            }
        });

        if (!userProject) {
            return res.status(404).json({ message: "Projet introuvable ou vous n'avez pas la permission de supprimer ce projet." });
        }

        const taskIds = await tache_projet.findAll({
            where: { projet_id: id },
            attributes: ['tache_id']
        });

        const tasksToDelete = taskIds.map(task => task.tache_id);

        await tache_projet.destroy({
            where: { projet_id: id }
        });

        await tache_utilisateur.destroy({
            where: { tache_id: tasksToDelete }
        });

        await tache.destroy({
            where: { id: tasksToDelete }
        });

        await projet_utilisateur.destroy({
            where: { projet_id: id }
        });

        await projet.destroy({
            where: { id: id }
        });

        res.status(200).json({ message: "Projet supprimé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


module.exports = {
    getAllProjects,
    getProjectByName,
    getProjectsByRole,
    createProject,
    updateProject,
    deleteProject
};