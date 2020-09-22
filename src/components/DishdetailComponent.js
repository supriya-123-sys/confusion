import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle,BreadcrumbItem,Breadcrumb,Button,Modal, ModalHeader, ModalBody, FormGroup, Label,Row, Col} from 'reactstrap';
import { LocalForm, Control,Errors } from 'react-redux-form';
import { Link } from "react-router-dom";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false
            
        }
        this.toggleModal=this.toggleModal.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    toggleModal(){
        this.state=({
            isModalOpen:!this.state.isModalOpen
        })
    }
    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }  
    render(){
        return( 
            <React.Fragment>
             <Button outline onClick={this.toggleModal}>
                <span className="fa fa-pencil fa-lg"></span>Submit Comment
                </Button> 
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>  
                <ModalBody>  

            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <Row className="form-group">
            <Label htmlFor="rating" md={2}>Rating</Label>
            <Col md={10}>
            <Control.select model=".rating" name="rating"
                                    className="form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
            </Col> 
            </Row>
             <Row className="form-group">
                            <Label htmlFor="yourname" md={2}>Your Name</Label>
                            <Col md={10}>
                            <Control.text model=".yourname" id="yourname" name="yourname"
                                    placeholder="Name"
                                    className="form-control"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                     />
                             <Errors 
                               className="text-danger"
                               model=".yourname"
                               show="touched"
                               messages={{
                                   required:'Required',
                                   minLength:'must be greater than 2 characters',
                                   maxLength:'must be 15 characters or less'
                               }}
                            />
                            </Col>
                        </Row> 
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="comment">Comment</Label>
                            <Control.textarea model='.comment' id='comment' rows='6' className="form-control" />
                            </Col>
                        </Row>
                        <Button type="submit" className="bg-primary">Submit</Button>        
            </LocalForm>
            </ModalBody>
            </Modal>
            </React.Fragment>
        )
    }
}


function RenderComments(comments,dishId,postComment){
    
        if (comments!=null) {
            
            return(
                <div  className='col-12 col-md-5 m-1'>
                <h4> Comments </h4>
                <ul className="list-unstyled">
                <Stagger in>
                    {comments.map(comment => {
                          console.log("comments map is a problem");   
                    return( 
                        <Fade in key={comment.id}>
                      <li key={comment.id}>
                         <p>{comment.comment}</p>
                         <p>-- {comment.author},
                          &nbsp;
                          {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit'
                        }).format(new Date(comment.date))}
                         </p>
                      </li>
                   </Fade>
                    );
                    })}
                    </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment} /> 
                 </div>);   
            
        }
        else
          return (
            <div></div>       
            );
    }

    function RenderDish({dish}) {
        if (dish != null) {
       
            return (
                
                <div className='col-12 col-md-5 m-1'>
                     <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                    </FadeTransform>
                </div>
                
            )
        }
        else {
            return (<div></div>)
        }
    }

   
   
        const DishDetail=(props)=> {
            //const dish = props.dish
            if (props.isLoading) {
                return(
                    <div className="container">
                        <div className="row">            
                            <Loading />
                        </div>
                    </div>
                );
            }
            else if (props.errMess) {
                return(
                    <div className="container">
                        <div className="row">            
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                );
            }

            else if (props.dish!=null){
                //const commentItem =RenderComments(props.comments)
                //const dishItem = RenderDish(dish)
                return (
                <div className="container">
                     <div className="row">
                       <Breadcrumb>
                          <BreadcrumbItem> <Link to='\menu'>Menu</Link> </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                       </Breadcrumb>
                       <div className="col-12">
            <h3>{props.dish.name}</h3>
                           <hr />
                       </div>
                    </div>
                <div className='row'>
                    {/*{dishItem}*/}
                    <RenderDish dish={props.dish} />
                    <RenderComments  comments={props.comments}
                      postComment={props.postComment}
                     dishId={props.dish.id} />
                  {/*{commentItem}
            
                     {/* <RenderComments comments={props.comments}/>
        addComment={props.addComment}
        dishId={props.dish.id}
            />*/}
                </div>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
        }

    


export default DishDetail;