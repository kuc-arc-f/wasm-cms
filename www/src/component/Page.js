import React from 'react'
//import { Link } from 'react-router-dom';
import LibCommon from '../libs/LibCommon';
import LibCmsEdit_3 from '../libs/LibCmsEdit_3';
import axios from 'axios'
import marked from  'marked'
//import $ from  'jquery'

//import '../css/page.css';

//
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: ''}
        this.id = ""
    }
    componentDidMount(){
        this.id  = this.props.match.params.id 
        console.log( this.id   )
        this.get_item( this.id )
    }
    get_item(id){
        var dt = LibCommon.formatDate( new Date(), "YYYY-MM-DD_hhmmss");
        axios.get('./cms.json?' + dt).then(res =>  {
            var data = res.data
//            console.log( data.page_items )   
            var items = LibCommon.convert_items(data.page_items )
            var item  = LibCmsEdit_3.get_page_item( items, String(id) )
            console.log( item )                     
           item.content = marked(item.content)
           this.setState({ data: item })
// console.log( item.content )
        })
    }
    get_content(){
        console.log( "#-get_content" )
        return false
    }    
    render(){
        return(
            <div className="container mt-2">
                <div className="page_head_wrap mt-2">
                    <i className="fas fa-home"></i> > {this.state.data.title}
                </div>
                <hr />
                <h1>{this.state.data.title}</h1>
                date : {this.state.data.created_at} <br />
                ID : {this.state.data.id} <br />
                <hr />
                <div id="post_item"
                dangerouslySetInnerHTML={{ __html: this.state.data.content }} />
            </div>
        )
    }
}

export default Page;

