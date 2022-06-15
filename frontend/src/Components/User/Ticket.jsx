// specific ticket we want to examine
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card, FormText } from "react-bootstrap";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";
import { parseHtml } from "../../utils/Util";

import TicketForm from "./TicketForm";
import DeleteButton from "./DeleteButton";
import TicketComments from "./TicketComments";


function Ticket({ ticketData, clickClose, setShow }) {
    const [thisTicketInfo, setThisTicketInfo] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);

    useEffect(() => {
        setThisTicketInfo(ticketData);
    }, []);

    useEffect(() => {
        if(thisTicketInfo !== null) {
            (async() => {
                const getTicketInfo = await azureConnection.getWorkItem(thisTicketInfo[0], thisTicketInfo[1]);
                setAllTicketInfo(getTicketInfo);
                console.log(getTicketInfo);
            })();
        }
    }, [thisTicketInfo]);

    /*comments from work item*/
    const [workItemComments, setWorkItemComments] = useState(null);
    useEffect(() => {
        (async () => {
            const workItemComments = await azureConnection.getWorkItemComments(allTicketInfo.fields["System.AreaPath"], allTicketInfo.id);
            setWorkItemComments(workItemComments);
        })();
    }, [allTicketInfo]);

    /*render edit state. if true, swap to edit ticket view*/
    const [renderEdit, setRenderEdit] = useState(null);

    /*TODO: need to close modal and refresh tickets*/
    /*delete ticket*/
    const [deleteTicket, setDeleteTicket] = useState(false);
    /*delete ticket call when deleteTicketId !== null*/
    useEffect(() => {
        if(deleteTicket) {
            const deleteThisTicket = azureConnection.deleteWorkItem(allTicketInfo.fields["System.AreaPath"], allTicketInfo.id);
            clickClose(true);
        }
    }, [deleteTicket]);

    return (
        <>
            {renderEdit === null ?
                allTicketInfo ?
                    <Row>
                        <Col>
                            {/*TODO: fields for project/teams, field for ticket type (task, epic, issue*/}
                            {/*TODO: validation  for all fields*/}
                            <Form className="col s12">

                                {/*TICKET TITLE*/}
                                <Row className={"mb-4"}>
                                    <Col xs={10} className={"d-flex align-items-center"}>
                                        <h4 className={"mt-1 text-capitalize"}>{allTicketInfo.fields["System.Title"]}</h4>
                                    </Col>
                                    <Col xs={1} className={"mb-2"}>
                                        <DeleteButton setDeleteTicket={setDeleteTicket} />
                                    </Col>
                                    <hr className={"mt-1"}/>
                                </Row>

                                {/*WORK TYPE, STATE, PRIORITY*/}
                                <Row className={"mb-2"}>
                                    <Col>
                                        <h5 className={"inlineH5"} >Priority:</h5>
                                        <div className={"ms-2 form-control inactiveForms"}>{allTicketInfo.fields["Microsoft.VSTS.Common.Priority"]}</div>
                                    </Col>
                                    <Col>
                                        <h5 className={"inlineH5"} >Ticket Type:</h5>
                                        <div className={"ms-2 form-control inactiveForms"}>{allTicketInfo.fields["System.WorkItemType"]}</div>
                                    </Col>
                                    <Col>
                                        <h5 className={"inlineH5"} >Ticket State:</h5>
                                        <div className={"ms-2 form-control inactiveForms"}>{allTicketInfo.fields["System.State"]}</div>
                                    </Col>
                                    <hr className={"mt-5"}/>
                                </Row>

                                {/*ASSIGNED TO*/}
                                <Row className={"mb-4"}>
                                    <h5 className={"mb-3"}>Assigned To</h5>
                                    <Container>
                                        <div className={"form-control inactiveForms"}>{allTicketInfo.fields["System.AssignedTo"] ? allTicketInfo.fields["System.AssignedTo"] : "No assignment"}</div>
                                    </Container>
                                </Row>

                                {/*TICKET CREATED BY*/}
                                <Row className={"my-4"}>
                                    <h5 className={"mb-3"}>Created By</h5>
                                    <Container>
                                        <div className={"form-control inactiveForms"}>{allTicketInfo.fields["System.CreatedBy"]}</div>
                                    </Container>
                                </Row>

                                {/*DUE DATE*/}
                                <Row className={"my-4"}>
                                    <h5 className={"mb-3"}>Due Date</h5>
                                    <Container>
                                        <div className={"form-control inactiveForms"}>{allTicketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"]}</div>
                                    </Container>
                                </Row>

                                {/*CREATED DATE*/}
                                <Row className={"my-4"}>
                                    <h5 className={"mb-3"}>Created Date</h5>
                                    <Container>
                                        <div className={"form-control inactiveForms"}>{allTicketInfo.fields["System.CreatedDate"]}</div>
                                    </Container>
                                </Row>

                                {/*TICKET DESCRIPTION*/}
                                <Row className={"my-4"}>
                                    <Col>
                                        <h5>Ticket Description</h5>
                                        <article className={"border border-1 p-2 articleStyle inactiveForms"}>
                                            {parseHtml(allTicketInfo.fields["System.Description"])}
                                        </article>
                                    </Col>
                                </Row>

                                {/*TICKET MENTIONS SECTION*/}
                                <Row className={"my-4"}>
                                    <Col>
                                        <h5>Ticket Mentions</h5>
                                        <article className={"border border-1 p-2 articleStyle inactiveForms"}>
                                            {parseHtml(allTicketInfo.fields["Microsoft.VSTS.CMMI.Comments"])}
                                        </article>
                                    </Col>
                                </Row>

                                {/*TICKET COMMENTS*/}
                                <Row className={"mb-4"}>
                                    <h6 className={"fw-bold"}>Ticket Comments</h6>
                                    {workItemComments ?
                                        <TicketComments workItemComments={workItemComments} />
                                        : <p>No ticket comments available.</p>}
                                </Row>

                                {/*TICKET ATTACHMENTS*/}
                                <Row className="mb-4">
                                    <h5>Attachments</h5>
                                    {allTicketInfo.relations ?
                                        allTicketInfo.relations.map((thisAttachment, index) => {
                                            return(
                                                <Col xs={3} key={index} className={"my-2"}>
                                                    <Card className={"shadow"}>
                                                        <Card.Body>
                                                            <Card.Title title={thisAttachment.attributes.name} className={"text-truncate"}>
                                                                {thisAttachment.attributes.name}
                                                            </Card.Title>
                                                            <br />
                                                            <a className={"float-end"} href={thisAttachment.url + "?fileName=" + thisAttachment.attributes.name + "&download=true"} download>Download</a>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>);
                                        })
                                        : <div className={"border border-1 p-2 articleStyle"}>No attachments.</div>}
                                </Row>

                                <hr />

                                <Button onClick={() => setRenderEdit(true)} type={"button"} name={"action"} className={"mt-2"}>
                                    EDIT TICKET
                                </Button>

                                <Button onClick={clickClose} type={"button"} name={"action"} className={"float-end mt-2"}>
                                    CLOSE
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    : <Container>Loading Ticket Info...</Container>
                : null}

            {renderEdit === true ? <TicketForm ticketData={ticketData} editTicket={true} ticketInfo={allTicketInfo} setShow={setShow}  /> : null}
        </>
    );
}

Ticket.propTypes = {
    ticketData: PropTypes.array,
    clickClose: PropTypes.func,
    setShow: PropTypes.func
};

export default Ticket;
