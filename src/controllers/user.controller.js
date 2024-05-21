const { User, Parent } = require("../models/user.model");

exports.createUser = async (req, res) => {
  try {
    const { name, parentId, parentName } = req.body;
    
    let newUser;

    if(parentId) {
        const parentUser = await Parent.findById(parentId);
      if (!parentUser) {
        return res.status(400).json({ error: 'Parent user not found' });
      }
      newUser = new User({ name, parentId });
    } else if (parentName) {
      const newParent = new Parent({ name: parentName });
      await newParent.save();
      newUser = new User({ name, parentId: newParent._id });
    } else { newUser = new User({ name });
    }
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.distributeEarnings = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }                
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const distribution = {
      level0: 0.05 * amount,
      level1: 0.05 * amount,
      level2: 0.05 * amount,
      level3: 0.05 * amount,
      level4: 0.05 * amount,
      level5: 0.05 * amount,
      level6: 0.1 * amount,
      level7: 0.2 * amount,
      level8: 0.4 * amount,
    };

    let distributedAmount = 0;
    for (const [key, value] of Object.entries(distribution)) {
      distributedAmount += value;
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: { distributedAmount: distributedAmount } },
      { $inc: { earnings: amount - distributedAmount } }
    );

    const updatedUser = await User.findById(userId);

    console.log("Updated User:", updatedUser);

    return res.status(200).json({ message: 'Earnings distributed successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
