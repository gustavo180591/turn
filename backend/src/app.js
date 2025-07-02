import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import turnosRoutes from './routes/turnos.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/turnos', turnosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});