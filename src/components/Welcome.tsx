import { FormStartProps } from "../types";

function Welcome({ nextStep }: FormStartProps) {
  return (
    <div>
      <p>
        Click the button below to start the sign up process.
      </p>
      <div className="buttons">
        <button id='get-started-btn' onClick={nextStep}>Get started</button>
      </div>

    </div>
  );
}

export default Welcome;

