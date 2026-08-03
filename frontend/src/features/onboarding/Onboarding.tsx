import { useState, FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';

export function Onboarding() {
  const { saveProfile } = useAppContext();
  
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [goal, setGoal] = useState('maintain');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!age || !weight || !height) return;

    saveProfile({
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      goal
    });
  };

  return (
    <div className="full-screen-center">
      <div className="card onboarding-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="brand" style={{ margin: 0, fontSize: '1.5rem', padding: 0 }}>ForgeFit AI</h1>
          <p className="page-subtitle" style={{ marginTop: '8px' }}>Let's build your physical profile.</p>
        </div>

        <form className="workout-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                required 
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="75"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                required 
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label>Primary Goal</label>
            <select className="form-control" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="cut">Cut (Lose Fat)</option>
              <option value="maintain">Maintain (Recomp)</option>
              <option value="bulk">Bulk (Build Muscle)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '24px', padding: '12px' }}
          >
            Complete Profile & Enter
          </button>
        </form>
      </div>
    </div>
  );
}
