import { useState, useEffect } from 'react';
import { MDBInput } from "mdbreact";
import './index.scss';

const MooningBottomLineInput = (props) => {
    const { prefix, defaultValue, type, minValue, maxValue, maxLength, disableModify, fixedDecimalCount,
         valueChangeHandler, valid, className, label, floatCount, removeRegex } = props;
    const [inputValue, setInputValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    
    useEffect(() => {
        if(type === "number" && !isFocused) {
            let validatedNumber = validateNumber(defaultValue, minValue, maxValue, floatCount, fixedDecimalCount)
            valueChangeHandler(validatedNumber)
        }
    }, [isFocused])
    useEffect(() => {
        if(type === "number" && !isFocused) {
            let validatedNumber = validateNumber(defaultValue, minValue, maxValue, floatCount, fixedDecimalCount)
            if(defaultValue === validatedNumber) {
                setInputValue(defaultValue)    
            }
            else {
                valueChangeHandler(validatedNumber)
            }
        }
        else {
            setInputValue(defaultValue)
        }
    }, [defaultValue, fixedDecimalCount])
    const validateNumber = (value, min, max, float, fixedFloat) => {
        let validatedNumber = Math.min(Math.max(Number(value), min), max)
        if(fixedFloat !== null) {
            validatedNumber = validatedNumber.toFixed(fixedFloat)
        }
        else {
            validatedNumber = Math.trunc(validatedNumber * Math.pow(10, float)) / Math.pow(10, float)
        }
        return validatedNumber.toString()
    }
    const changeHandler = (e) => {
        if(disableModify) return
        if(type === "text") {
            let str = e.target.value
            if(maxLength !== 0) {
                str = str.slice(0, maxLength)
            }
            if(removeRegex !== null) {
                str = str.replace(removeRegex, '')
            }
            valueChangeHandler(str)
            return
        }
        valueChangeHandler(e.target.value)
    }
    const focusAction = (x) => {
        setImmediate(() => {
            x.target.select();
        })
        setIsFocused(true);
    }
    const blurAction = () => {
        setIsFocused(false);
    }
    return (
        <div className={`mooning-input-container ${valid? "": "not-valid"} ${disableModify? "disable-modify": ""}`}>
            <p className="mooning-input-label">{label}</p>
            <div className="mooning-input-main">
                <div className='input-prefix'>
                    {prefix}
                </div>
                <input onBlur={blurAction} onFocus={focusAction} disabled={disableModify}
                    label={label} value={inputValue} onChange={changeHandler}
                    background size="sm" type={type} min={minValue} />
            </div>
        </div>
    );
}
  
MooningBottomLineInput.defaultProps = {
    floatCount: 0,
    maxValue: Number.MAX_VALUE,
    minValue: Number.MIN_VALUE,
    maxLength: 0,
    disableModify: false,
    fixedDecimalCount: null,
    removeRegex: null
};
export default MooningBottomLineInput;