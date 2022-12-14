import React from "react";
//import '/styles/css/Button.css';
import { Link } from "react-router-dom";


const STYLES = ['btn--primary', 'btn--outline', 'btn--dark'];

const SIZES = ['btn--medium', 'btn--large'];

type buttonProps = {
    children: any
    type?: string
    onClick?: any
    buttonStyle?: string
    buttonSize?: string
    pathTarget?: string
    path?: string
    className?: string
    title?: string
}

const Button: React.FC<buttonProps> = (props) => {
    const checkButtonStyle = STYLES.includes(props.buttonStyle != undefined ? props.buttonStyle : "") //if passed in style is not available, default to array position 1
        ? props.buttonStyle 
        : STYLES[0];

    const checkButtonSize = SIZES.includes(props.buttonSize != undefined ? props.buttonSize : "")  //if passed in size is not available, default to array position 1
        ? props.buttonSize
        : SIZES[0];

    const targetPath = props.pathTarget
        ? props.pathTarget
        : '_self'

    const link = props.path? props.path : '/'

    //return with link only if path is given
    return(
        <>
        {props.path &&
            <Link to={link} className='btn-mobile' target={targetPath}>
                <button 
                    title={props.title}
                    className={`btn ${checkButtonSize} ${checkButtonStyle} ${props.className}`} //fill in all passed in values
                    onClick={props.onClick}
                    //type={props.type} idk for what this was
                >
                    {props.children}
                </button>
            </Link>
        }
        {!props.path &&
        <button 
            title={props.title}
            className={`btn ${checkButtonSize} ${checkButtonStyle} ${props.className}`} //fill in all passed in values
            onClick={props.onClick}
            //type={props.type} idk for what this was
        >
            {props.children}
        </button>
        }
        </>
    )
}

export default Button