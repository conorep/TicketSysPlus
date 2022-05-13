import React from "react";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";

import NavBarHeader from "../NavBarHeader";
import PrjSideBar from "../StandardUser/ProjectsSideBar";
import UserTickets from "../StandardUser/userTickets";
import {Container, Row} from "react-bootstrap";

function StandardUser(props) {
    const authRequest = {
        ...loginRequest
    };

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <NavBarHeader />
            <div className="row">

                <div className="col-3 " id="sidebar"><PrjSideBar /></div>

                <div className="col-8">

                    <Container>
                        <Row>
                            <UserTickets />
                        </Row>
                    </Container>

                </div>

            </div>

        </MsalAuthenticationTemplate >
    );
}

export default StandardUser;
