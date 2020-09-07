import React from 'react'
import * as wasm from "wasm-cms";
import axios from 'axios';
import LibCommon from '../libs/LibCommon';
import LibPaginate from '../libs/LibPaginate';

//
class Test extends React.Component {
    constructor(props) {
    super(props);
    //    this.state = {data: ''}
        this.state = {
            data: '', 
            pages_display:0 ,
            items_all: [],
            page_max : 1,
            page_number : 1,
            pagenate_display: 0,
        }
        this.page_one_max = 20
    }  
    componentDidMount(){
        var dt = LibCommon.formatDate( new Date(), "YYYY-MM-DD_hhmmss");
        axios.get('./cms.json?' + dt).then(response => {
            var resData = response.data
            resData.items = LibCommon.get_reverse_items( resData.items )
            this.setState({ data: resData })
            if(resData.file_version != null){
                if(this.state.data.page_items != null){
                    if(this.state.data.page_items.length > 0){
                        this.setState({ pages_display: 1 })
                    }
                }
                this.setState({ items_all: this.state.data.items })
            }else{
                alert("Error, file version can not import, version 2 over require")
            }
            var page_max = LibPaginate.get_max_page(this.state.data.items, this.page_one_max)
            this.setState({ page_max: page_max })
            var items = LibPaginate.get_items(this.state.data.items, this.state.page_number , this.page_one_max )
            resData.items = items
            this.setState({ data: resData })
            if(page_max > 1){
                this.setState({ pagenate_display: 1 })
            }
console.log( this.state.pagenate_display )            
        })
        .catch(function (error) {
            console.log(error)
        })      
        //    wasm.greet();
    }
    tabRow(){
        if(this.state.data.items instanceof Array){
            return this.state.data.items.map(function(object, i){
                console.log(object)
                var json = JSON.stringify( object );
                wasm.wasm_post_row("ul_post_wrap", String(json) );
//                return <TopPostsRow obj={object} key={i} />
            })
        }
    }    
    render(){
        return(
        <div>
            <h1>test</h1>
            <h2>welcome, test2</h2>
            <div id="ul_post_wrap">post:
                {this.tabRow()}
            </div>
        </div>
        )
    }
}

export default Test;

