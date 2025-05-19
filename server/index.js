import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error;

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post('/api/meal', authenticate, async (req, res) => {
  const { title, date, meal_type, notes, total_calories, total_protein, total_fat, total_carbs } = req.body;

  const { error } = await supabase.from('meal_plans').insert([
    {
      user_id: req.user.id,
      title,
      date,
      meal_type,
      notes,
      total_calories,
      total_protein,
      total_fat,
      total_carbs,
    },
  ]);

  if (error) return res.status(500).json({ error });
  res.status(201).json({ message: 'Meal plan inserted' });
});


app.post('/api/combos', authenticate, async (req, res) => {
  const { combination } = req.body;

  const { error } = await supabase.from('favorite_combinations').insert([
    {
      user_id: req.user.id,
      combination,
    },
  ]);

  if (error) return res.status(500).json({ error });
  res.status(201).json({ message: 'Combination added' });
});


app.delete('/api/combos/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('favorite_combinations')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error });
  res.status(200).json({ message: 'Combination deleted' });
});

app.post('/api/stats', authenticate, async (req, res) => {
  const { weight, height } = req.body;

  const { error } = await supabase.from('user_stats').insert([
    {
      user_id: req.user.id,
      weight,
      height,
      date: new Date().toISOString(),
    },
  ]);

  if (error) return res.status(500).json({ error });
  res.status(201).json({ message: 'Stats saved' });
});

app.get('/api/stats', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json({ data });
});

app.get('/api/combos', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('favorite_combinations')
    .select('*')
    .eq('user_id', req.user.id)
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json({ data });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
app.get('/api/analytics/weight-summary', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('weight, date')
    .eq('user_id', req.user.id)
    .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) return res.status(500).json({ error });

  if (!data || data.length === 0) {
    return res.json({ average_weight: null, count: 0 });
  }

  const total = data.reduce((sum, item) => sum + item.weight, 0);
  const avg = total / data.length;

  res.json({ average_weight: parseFloat(avg.toFixed(2)), count: data.length });
});