class Chat extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {login_text: '', is_connected: false, user_input_text: '', tabmess: [""]}

        this.enter_login = this.enter_login.bind(this)

        this.check_connexion = this.check_connexion.bind(this)

        this.user_text = this.user_text.bind(this)

        this.message_sent = this.message_sent.bind(this)

    }

    enter_login(event) {

        this.setState({login_text: event.target.value})

    }

    check_connexion(event) {

        this.setState({ is_connected: !this.state.is_connected })

    }

    user_text(event) {

        this.setState( {user_input_text: event.target.value})

    }

    message_sent(event) {

        this.setState( { tabmess: [...this.state.tabmess, this.state.user_input_text] } )

        this.setState({ user_input_text: '' })

    }

    render() {

        return ( <div>

            <Header login_value = {this.state.login_text} change_login_text = {this.enter_login} if_connected = {this.state.is_connected} change_connexion = {this.check_connexion} />
            <Middle_page if_connected = {this.state.is_connected} typing = {this.state.user_input_text} user_typed_text = {this.user_text} message_sent = {this.message_sent}
                         tabmess = {this.state.tabmess}/>
            <Footer />

        </div>

        )

    }
    
}

function Header(props) {

    let checking_logged

    if ( props.if_connected == false ) {

        checking_logged = <React.Fragment>

            <input type='text' placeholder='Entrez Votre Pseudo : ...' id='login_input' value = {props.login_value} onChange = {props.change_login_text} />

            <a href='#' id='login_button' onClick = {props.change_connexion} >Login</a> 

        </React.Fragment>

    }

    else {

        checking_logged = <React.Fragment>

            <p>{props.login_value}</p>

            <a href='#' id='logout_button' onClick = {props.change_connexion} >Logout</a> 

        </React.Fragment>

    }

    return <div className='flex_between header' >

        <div>

            <h1>Mimi Chat</h1>

        </div>

        <div className='flex'>
        
            {checking_logged}

        </div>

    </div>

}

function Middle_page(props) {

    return <div className='flex'>

        <Left_online_status />

        <Chat_display_and_type if_connected = {props.if_connected} typing = {props.typing}  user_typed_text = {props.user_typed_text} message_sent = {props.message_sent}
            tabmess = {props.tabmess}
        />

    </div>

}


function Left_online_status(props) {

    return <div className='left_status_online'>

        <h2>Utilisateurs en Ligne :</h2>

    </div>

}


function Chat_display_and_type(props) {
   

    return <div className='w-75'>

        <Chat_display typing = {props.typing}  user_typed_text = {props.user_typed_text} tabmess = {props.tabmess} />
        <Chat_box if_connected = {props.if_connected} typing = {props.typing}  user_typed_text = {props.user_typed_text} message_sent = {props.message_sent}/>

    </div>

}

function Chat_display(props) {

    console.log(props.typing)

    return <div className='chat_display'>

        <div>

            <div className='chat_display_text'>{props.tabmess.map((elem, key) => <div>{elem}</div>)} </div>

        </div>

    </div>

}

function Chat_box(props) {

    // console.log(props.typing);

    let textareaclass = ''

    if ( props.if_connected == false) {

        textareaclass = 'display_none'

    }

    return <div className='flex chat_box'>

        <div>

            <input type='text' id='input_chat_box' placeholder='Tapez pour Discuter ...' className={textareaclass} value = {props.typing} onChange = {props.user_typed_text}/>

        </div>

        <div>

            <a href='#' id='send_message_button' className={textareaclass} onClick = {props.message_sent} >Envoyer</a>

        </div>

    </div>

}

function Footer(props) {

    return <div className='footer'>

        <h2>Copyright : Moi ©</h2>

    </div>

}

ReactDOM.render(<Chat />, document.getElementById("chat_main_page"))