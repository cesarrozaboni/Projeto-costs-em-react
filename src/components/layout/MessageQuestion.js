import styles from './MessageQuestion.module.css'

/**
 * Adiciona Mensagem de pergunta na tela
 */
function MessageQuestion({message, handleAccept, handleCancel}){

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <h2>Confirma?</h2>
                <h3>{message}</h3>
                <br />
                <div>
                    <button className={styles.btn} onClick={handleAccept}>SIM</button>
                    <button className={styles.btn} onClick={handleCancel}>NÃO</button>
                </div>
            </div>
        </div>
    )
}

export default MessageQuestion