import styles from './Container.module.css'

/**
 * Adicionar container em tela
 */
function Container(props){
    return (
             <div className={`${styles.container} ${styles[props.customClass]}`}>{props.children}</div>
        )
}

export default Container