import { Tab } from './components';
import { Clock } from './modules/Clock';
import { Stopwatch } from './modules/Stopwatch';
import { Timer } from './modules/Timer';

function App() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Tab.Group alignment='center' initialActiveTab='Timer'>
        <Tab.Item tabKey='Timer' label='Timer'>
          <Timer />
        </Tab.Item>

        <Tab.Item tabKey='Clock' label='Clock'>
          <Clock />
        </Tab.Item>

        <Tab.Item tabKey='Stopwatch' label='Stopwatch'>
          <Stopwatch />
        </Tab.Item>
      </Tab.Group>
    </div>
  );
}

export default App;
