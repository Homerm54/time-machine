import styled from "styled-components";

const Container = styled.div`
  max-width: 50%;
  margin: auto;

  & > * {
    margin: 1rem 0;
  }

  & > ul {
    margin: 1rem 1rem;
  }

  & > .info {
    color: ${({ theme }) => theme.palette.info.main};
  }
`;

function About(): JSX.Element {
  return(
    <Container>
      <h4>Time Machine</h4>

      <p>
        This web app reprensents a <strong>time machine</strong>, a basic app with a Timer and a Stopwatch module.
        <br />
        This project was done to implement <strong>State Charts / State Machines</strong> in the management of UI state, alongside with React.
      </p>

      <p>
        To implement ease the implementation, the XState lib was used, along with the special hooks provided by XState to use in React.
      </p>

      <p>
        The Timer and Stopwatch, both uses, to name a few:
      </p>

      <ul>
        <li>Actor Model - Invoking services</li>
        <li>Actions</li>
        <li>State Charts</li>
        <li>Sub States</li>
        <li>Services as prop</li>
        <li>Hooks in @xstate/react</li>
        <li>State Machines + Typescript</li>
        <li>Transient State Nodes</li>
      </ul>

      <div className="info">
        From README.md - Hosted on Github Pages.
      </div>
    </Container>
  );
}

export { About };
