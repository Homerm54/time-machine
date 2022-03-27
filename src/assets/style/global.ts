import { createGlobalStyle } from "styled-components";

export default createGlobalStyle
`
// Font Families: Montserrat as Main - Nunito as Secondary
* {
    margin: 0;
    padding: 0;
    outline:0;
    font-family: 'Montserrat', sans-serif;
    // font-family: 'Nunito', sans-serif;
}

*, :after, :before {
  box-sizing: border-box;
}

body, html, #root {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

body {
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  letter-spacing: 0.00938em;
}

#root {
  color: ${props => props.theme.palette.text.primary};
  background-color: ${props => props.theme.palette.background.default};
}


// Utilities Classes, extracted from https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.css

@media (prefers-reduced-motion: no-preference) {
  :root {
    scroll-behavior: smooth;
  }
}

// Form Buttons
label {
  display: inline-block;
}

button {
  border-radius: 0;
}

button:focus:not(:focus-visible) {
  outline: 0;
}

input,
button,
select,
optgroup,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button,
select {
  text-transform: none;
}

[role=button] {
  cursor: pointer;
}

select {
  word-wrap: normal;
}
select:disabled {
  opacity: 1;
}

::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

textarea {
  resize: vertical;
}

fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

button,
[type=button],
[type=reset],
[type=submit] {
  -webkit-appearance: button;
}
button:not(:disabled),
[type=button]:not(:disabled),
[type=reset]:not(:disabled),
[type=submit]:not(:disabled) {
  cursor: pointer;
}

::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

textarea {
  resize: vertical;
}

fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

[hidden] {
  display: none !important;
}
`;
