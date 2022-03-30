import { Tab } from './components';
import { Timer } from './modules/Timer';
import { Stopwatch } from './modules/Stopwatch';

function App() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}>Timer Machine</h1>

      <Tab.Group alignment='center' initialActiveTab='Timer'>
        <Tab.Item tabKey='Timer' label='Timer'>
          <Timer />
        </Tab.Item>

        <Tab.Item tabKey='Stopwatch' label='Stopwatch'>
          <Stopwatch />
        </Tab.Item>
      </Tab.Group>
    </div>
  );
}

export default App;
