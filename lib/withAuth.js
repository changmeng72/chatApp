
import React from "react";
import Router from 'next/router';

let globalUser = null;

export default function withAuth (BaseComponent,
    { loginRequired = true, logoutRequired = false } = {}){

    class App extends React.Component{

        componentDidMount(){
          const  {user,isFromServer} = this.props;
            if(isFromServer)
               globalUser = user;

            if(loginRequired && !user && !logoutRequired ){
                Router.push('/login');
                return;
            }
            if(logoutRequired && user){
                Router.push('/');
                return;
            }
        }

        render(){
            const {user} = this.props;
            if(loginRequired && !user && !logoutRequired)
                return null;
            if(user && logoutRequired)
                return null;


            return (<>
            <BaseComponent {...this.props} /> 
            </>
            );
        }

    }

    App.getInitialProps = async (ctx) => {
        let user = globalUser;
        const isFromServer = typeof window === 'undefined';

        if( isFromServer && !!ctx.req.user){
            user = ctx.req.user.toObject();            
        }
        
        if (isFromServer && user) {
            user._id = user._id.toString();
        }

        let props = {user,isFromServer}
        if(!!BaseComponent.getInitialProps){

          let b_props =  (await BaseComponent.getInitialProps(ctx)) || {};

          Object.assign(props, b_props);
          
        }
        return props;

    };

   return App;
}
