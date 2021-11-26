class Chat extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {login_text: '', is_connected: false}

        this.enter_login = this.enter_login.bind(this)

    }

    enter_login(event) {

        this.setState({login_text: event.target.login_text})

    }

    render() {

        return ( <div>

            <Header login_value = {this.state.login_text} change_login_text = {this.enter_login} />
            <Middle_page />
            <Footer />

        </div>


        )

    }
    

}

function Header(props) {

    return <div className='flex_between header' >

        <div>

            <h1>Mimi Chat</h1>

        </div>

        <div>

            <input type='text' placeholder='Entrez Votre Pseudo : ...' id='login_input' value = {props.login_value} onChange = {props.change_login_text} />

            <a href='#' id='login_button'>Login</a> 

            <p>{props.login_text}</p>

        </div>


    </div>

}

function Middle_page(props) {

    return <div className='flex bg_white'>

        <Left_online_status />

        <Chat_display_and_type />

    </div>

}


function Left_online_status(props) {

    return <div className='bg_salmon left_status_online'>

        <h2>Utilisateurs en Ligne :</h2>

    </div>

}


function Chat_display_and_type(props) {

    

    return <div className='w-75'>

        <Chat_display />
        <Chat_box />

    </div>

}

function Chat_display(props) {

    return <div className='bg_blue chat_display'>

        <div>

            <h2 className='chat_display_text'>Chat Display box</h2>

            <div className='text'></div>

        </div>

    </div>

}

function Chat_box(props) {


    return <div className='flex bg_red chat_box'>

        <div>

            <input type='text' id='input_chat_box' placeholder='Tapez pour Discuter ...' />

        </div>

        <div>

            <a href='#' id='send_message_button'>Envoyer</a>

        </div>

    </div>

}

function Footer(props) {

    return <div className='footer'>

        <h2>Copyright : Moi ©</h2>

    </div>

}

ReactDOM.render(<Chat />, document.getElementById("chat_main_page"))