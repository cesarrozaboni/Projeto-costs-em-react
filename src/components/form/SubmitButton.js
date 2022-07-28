import styles from './SubmitButton.module.css'

/**
 * Adicionar button para submit em tela
 */
function SubmitButton({text}){

    return (
        <div>
            <button className={styles.btn}>{text}</button>  
        </div>
    )
}

export default SubmitButton