import { h, Fragment } from "preact";

interface InputSecretProps {
  onInput: (value: string) => void;
}

const InputSecret = ({ onInput }: InputSecretProps) => {
  const inputHandler = (ev: Event) => {
    onInput((ev.target as HTMLInputElement).value);
  };

  return (
    <Fragment>
      <label for="secret">
        If you have a <i>secret</i> paste it below:
      </label>
      <div>
        <input type="text" id="secret" onInput={inputHandler} />
      </div>
    </Fragment>
  );
};

export default InputSecret;
