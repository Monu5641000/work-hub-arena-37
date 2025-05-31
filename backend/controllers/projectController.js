
const Project = require('../models/Project');
const User = require('../models/User');
const Proposal = require('../models/Proposal');

// Get all projects with filters
exports.getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      skills,
      budgetMin,
      budgetMax,
      experienceLevel,
      duration,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'open' };

    if (category) filter.category = category;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (duration) filter.duration = duration;
    if (skills) {
      filter.skills = { $in: skills.split(',') };
    }
    if (budgetMin || budgetMax) {
      filter['budget.amount.min'] = {};
      if (budgetMin) filter['budget.amount.min'].$gte = Number(budgetMin);
      if (budgetMax) filter['budget.amount.max'] = { $lte: Number(budgetMax) };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .populate('client', 'firstName lastName profilePicture rating location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'firstName lastName profilePicture rating location')
      .populate('freelancer', 'firstName lastName profilePicture rating skills')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancer',
          select: 'firstName lastName profilePicture rating skills hourlyRate'
        }
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      client: req.user.id
    };

    const project = await Project.create(projectData);

    const populatedProject = await Project.findById(project._id)
      .populate('client', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Don't allow updates if project is in progress or completed
    if (['in-progress', 'completed'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update project that is in progress or completed'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('client', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Don't allow deletion if project has proposals or is in progress
    if (project.proposals.length > 0 || project.status === 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with proposals or in progress'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Get user's projects (client or freelancer)
exports.getMyProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (req.user.role === 'client') {
      filter.client = req.user.id;
    } else if (req.user.role === 'freelancer') {
      filter.freelancer = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .populate('client', 'firstName lastName profilePicture')
      .populate('freelancer', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your projects',
      error: error.message
    });
  }
};
