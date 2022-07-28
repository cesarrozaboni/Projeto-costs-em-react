import {useEffect, useState} from 'react'
import styles                from './ProjectForm.module.css'
import Input                 from '../form/Input'
import Select                from '../form/Select'
import SubmitButton          from '../form/SubmitButton'
import Message               from '../layout/Message'

/**
 * Formulario do projeto
 * @returns JSX
 */
function ProjectForm({phandleSubmit, btnText, projectData}){

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    //usado para evitar multiplas requisições no componente
    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        }).then((resp) => resp.json())
        .then((data) => {
            setCategories(data)
        })
        .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('')
            
        }, 3000)

        return () => clearTimeout(timer);
    }, [message])

    const submit = (e) => {
        e.preventDefault()
        
        if(e.target[0].value === undefined || e.target[0].value === ""){
            let campo = document.querySelector(`label[for=${e.target[0].name}]`).textContent
            setType('error')
            setMessage(`O campo ${campo} não pode ser vazio`)
            return false
        }

        if(e.target[1].value === undefined || e.target[1].value === ""){
            let campo = document.querySelector(`label[for=${e.target[1].name}]`).textContent
            setType('error')
            setMessage(`O campo ${campo} não pode ser vazio`)
            return false
        }

        if(e.target[2].value === undefined || e.target[2].value === ""){
            let campo = document.querySelector(`label[for=${e.target[2].name}]`).textContent
            setType('error')
            setMessage(`O campo ${campo} não pode ser vazio`)
            return false
        }

        phandleSubmit(project)
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
    }

    function handleCategory(e){
        setProject({...project, 
                     category: {
                         id: e.target.value,
                         name: e.target.options[e.target.selectedIndex].text
                     }})
    }

    return (
        <div>
            <Message type={type} msg={message} />
            <form onSubmit={submit} className={styles.form}>
                <Input 
                   type="text" 
                    text="Nome do Projeto" 
                    name="name" 
                    placeholder="Insira o nome do projeto"
                    handleOnChange={handleChange} 
                    value={project.name ? project.name : ''} /> 

                <Input 
                    type="number" 
                    text="Orçamento do projeto" 
                    name="budget" 
                    placeholder="Insira o orçamento total" 
                    handleOnChange={handleChange} 
                    value={project.budget ? project.budget : ''} />

                <Select 
                    name="Category_id" 
                    text="Selecione uma categoria" 
                    options={categories} 
                    handleOnChange={handleCategory} 
                    value={project.category ? project.category.id : ''} />       
                
                <SubmitButton text={btnText} />
            </form>
        </div>
    )
}

export default ProjectForm