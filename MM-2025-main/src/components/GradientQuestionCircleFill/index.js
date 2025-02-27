import {BsQuestionCircleFill} from 'react-icons/bs'

const GradientQuestionCircleFill = (props) => {
  return (
    <>
      <svg width="0" height="0">
        <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#ff01eb" offset="0%" />
          <stop stopColor="#7050cb" offset="100%" />
        </linearGradient>
      </svg>
      <BsQuestionCircleFill
        style={{ color: "white", stroke: "white", fill: "url(#blue-gradient)" }}
      />
    </>
  );
};

export default GradientQuestionCircleFill;
