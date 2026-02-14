import { useState } from "react";

const InputBox = ({
  name,
  type,
  id,
  value = "",
  placeholder,
  icon,
  disable = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        placeholder={placeholder}
        value={inputValue}
        id={id}
        disable={disable}
        className="input-box"
        onChange={(e) => setInputValue(e.target.value)}
      />

      <i className={"fi " + icon + " input-icon"}></i>

      {type === "password" && (
        <i
          className={
            "fi fi-rr-eye" +
            (!passwordVisible ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
          onClick={() => setPasswordVisible((currentVal) => !currentVal)}
        ></i>
      )}
    </div>
  );
};

export default InputBox;
