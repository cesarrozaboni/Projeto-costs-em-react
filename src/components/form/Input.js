import styles from './Input.module.css'

/**
 *  Componente para adicionar input na tela 
 */

function Input({type, text, name, placeholder, handleOnChange, value}){

    return (
        <div className={ styles.form_control }>
            <label htmlFor={name}>{text}</label>
            
            <input 
                type={type}
                id={name} 
                name={name} 
                placeholder={placeholder} 
                onChange={handleOnChange} 
                value={value} />
        </div>
    )
}

export default Input