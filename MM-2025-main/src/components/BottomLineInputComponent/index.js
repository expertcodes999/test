import { useState, useEffect } from 'react';
import { MDBInput } from "mdbreact";
import './index.scss';

const BottomLineInputComponent = (props) => {
    const { prefix, defaultValue, type, minValue, maxValue, valueChangeHandler, className, label, floatCount } = props;
    const [inputValue, setInputValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    useEffect(() => {
        if(type === "number" && !isFocused) {
            setInputValue(Number(defaultValue).toFixed(floatCount))
        }
        else {
            setInputValue(defaultValue)
        }
    }, [defaultValue])
    useEffect(() => {
        if(type === "number" && !isFocused) {
            let validatedNumber = Math.floor(Math.min(Math.max(Number(inputValue), minValue), maxValue) * 
                Math.pow(10, floatCount)) / Math.pow(10, floatCount)
            valueChangeHandler(validatedNumber)
        }
    }, [isFocused])
    const changeHandler = (e) => {
        if(type === "number" && isFocused) {
            setInputValue(e.target.value)
        }
        else {
            valueChangeHandler(e.target.value.toString());
        }
        
    }
    const focusAction = () => {
        setIsFocused(true)
    }
    const blurAction = () => {
        setIsFocused(false)
    }
    return (
        <div className={`input-container ${className}`}>
            <MDBInput onBlur={blurAction} onFocus={focusAction}
                label={label} value={Number(inputValue)} onChange={changeHandler}
                background size="sm" type={type}/>
            <div className='input-prefix'>
                {prefix}
            </div>
        </div>
    );
}
  
BottomLineInputComponent.defaultProps = {
    floatCount: 0,
    maxValue: Number.MAX_VALUE,
    minValue: Number.MIN_VALUE
};
export default BottomLineInputComponent;