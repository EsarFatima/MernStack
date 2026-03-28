const Creature = require('../models/Creature');

exports.getCreatures = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const creatures = await Creature.find({ owner: userId });
    res.json(creatures);
  } catch (err) {
    console.error('Get creatures error:', err);
    res.status(500).json({ error: 'Failed to fetch creatures' });
  }
};

exports.addCreature = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const { name, power } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Creature name is required' });
    }

    const newCreature = new Creature({ 
      name, 
      power: power || '', 
      owner: userId 
    });

    await newCreature.save();
    res.status(201).json(newCreature);
  } catch (err) {
    console.error('Add creature error:', err);
    res.status(500).json({ error: 'Failed to add creature' });
  }
};

exports.deleteCreature = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const { id } = req.params;

    const creature = await Creature.findOneAndDelete({ 
      _id: id, 
      owner: userId 
    });

    if (!creature) {
      return res.status(404).json({ error: 'Creature not found' });
    }

    res.json({ message: 'Creature deleted successfully' });
  } catch (err) {
    console.error('Delete creature error:', err);
    res.status(500).json({ error: 'Failed to delete creature' });
  }
};
