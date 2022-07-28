import { useLocation }         from 'react-router-dom'
import { useState, useEffect } from 'react'
import Message                 from "../layout/Message"
import styles                  from './Projects.module.css'
import Container               from '../layout/Container'
import Loading                 from '../layout/Loading'
import LinkButton              from '../layout/LinkButton'
import ProjectCard             from '../project/ProjectCard'
import MessageQuestion         from '../layout/MessageQuestion'

/**
 * Exibe os projetos cadastrados em tela
 * @returns JSX
 */
function Projects() {
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')
    const [messageQuestion, setMessageQuestion] = useState('')
    const [id, setId] = useState(0)

    const location = useLocation()
    let message = ''

    if(location.state){
        message = location.state.message
    }

    useEffect(() =>{
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            }).then(resp => resp.json())
            .then(data => {
                setProjects(data)
                setRemoveLoading(true)
            })
          .catch((err) => console.log(err))
        }, 300);
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setProjectMessage('')
        }, 3000)

        return () => clearTimeout(timer);
    }, [projectMessage])

    /**
     * Pergunta para remover o projeto
     */
    function questionRemoveProject(id, name){
        setMessageQuestion(`Deseja Remover o projeto '${name}'?`)
        setId(id)
    }

    /**
     * Cancela remover projeto
     */
    function cancelRemoveProject(){
        setMessageQuestion('')
        setId(0)
    }
    
    /**
     * Confirma remover projeto
     */
    function confirmRemoveProject(){
        setMessageQuestion('')
        removeProject(id)
    }

    /**
     * Remove o projeto
     */
    function removeProject(id){
        fetch(`http://localhost:5000/projects/${id}`,{
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
        })
          .then(() => {
              setProjects(projects.filter((project) => project.id !== id))
              setProjectMessage('Projeto removido com sucesso!')
          })
          .catch((err) => console.log(err))
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>

            {messageQuestion && <MessageQuestion message={messageQuestion} handleAccept={confirmRemoveProject} handleCancel={cancelRemoveProject} />}
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {projects.length > 0 && 
                    projects.map((projects) => 
                        <ProjectCard 
                        id={projects.id}
                        name={projects.name} 
                        budget={projects.budget}
                        category={projects.category.name}
                        key={projects.id}
                        handleRemove={questionRemoveProject}
                        /> 
                    )
                }
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não ha Projetos Cadastrados! </p>
                )}
            </Container>
        </div>
    )
}

export default Projects