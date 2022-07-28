import styles                  from './Project.module.css'
import { useParams }           from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading                 from '../layout/Loading'
import Container               from '../layout/Container'
import ProjectForm             from '../project/ProjectForm'
import ServiceForm             from '../service/ServiceForm'
import Message                 from '../layout/Message'
import { v4 as uuidv4 }        from 'uuid'
import ServiceCard             from '../service/ServiceCard'

/**
 * Pagina para editar projetos
 * @returns JSX
 */
function Project(){
    const { id } = useParams()
    const[project, setProject] = useState([])
    const[services, setServices] = useState([])
    const[showProjectForm, setShowProjectForm] = useState(false)
    const[message, setMessage] = useState()
    const[type, setType] = useState()
    const[showServiceForm, setShowServiceForm] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                }
            }).then(resp => resp.json())
            .then(data => {
                setProject(data)
                setServices(data.services)
            })
            .catch(err => console.log(err))
        }, 500)
    }, [id]);
   
    /**
     * Edita o projeto
     */
    function editPost(project){
        setMessage('')

        if(project.budget < project.costs){
            setMessage('O Orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado!')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    /**
     * Cria um serviço
     */
    function createService(){
        setMessage('')
        const lastService = project.services[project.services.length -1]
        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.costs) + parseFloat(lastServiceCost)
        
        lastService.id = uuidv4()
        
        if(newCost > parseFloat(project.budget)){
            
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        project.costs = newCost
        fetch(`http://localhost:5000/projects/${project.id}`,{
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(project)
        }).then((resp) => resp.json())
        .then((data) =>{
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.error(err))
    }

    /**
     * Remove um serviço
     */
    function removeService(id, cost){
        
        const servicesUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdate = project

        projectUpdate.services = servicesUpdate
        projectUpdate.cost = parseFloat(projectUpdate.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdate.id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(projectUpdate)
            }).then((resp) => resp.json())
              .then((data) =>{
                setProject(projectUpdate)
                setServices(servicesUpdate)
                setMessage('Serviço removido com sucesso!')
            }).catch((err) => console.log(err))
    }

    /**
     * Exibe/oculta formulario para edição do projeto
     */
    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    /**
     * Exibe/oculta formulario do serviço
     */
    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            { project.name ? (
             <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message} />}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado</span> R${project.costs}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm phandleSubmit={editPost} btnText="Concluir Edição" projectData={project} />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço: </h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (
                                <ServiceForm 
                                handleSubmit={createService}
                                btnText="Adicionar serviço"
                                projectData={project}
                                />
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass='start'>
                        {
                            services.length > 0 &&
                            services.map((service) => (
                                <ServiceCard 
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                                />
                            ))
                        }
                        {
                            services.length === 0 && <p>Não há Serviços Cadastrados </p>
                        }
                    </Container>
                </Container>
             </div>
            ) : (
            <Loading /> 
            )}
        </>
    )
}

export default Project