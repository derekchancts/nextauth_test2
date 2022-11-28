import bcrypt from 'bcrypt';
import Users from '../../models/userModel'


export default async function handler (req, res) {
  const { email, password } = req.body;
  // console.log(email, password)
  
  const user = await Users.findOne({ email });
  if (user) {
    res.status(400).json({ message: 'The email has already been registered. Please use another email' })
    return;
  }

  // const newUser = new Users({ email, password });
  const salt = await bcrypt.genSalt(12);
  // newUser.password = await bcrypt.hash(newUser.password, salt);
  const hashedpassword = await bcrypt.hash(password, salt);

  const newUser = new Users({ email, password: hashedpassword });
  await newUser.save();

  res.status(201).json({ message: 'registered successfully' })
  // newUser.save().then(doc => res.status(201).send(doc));

};