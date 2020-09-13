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
            resData.items = LibCommon.get_wasm_items( resData.items )
//            resData.items = LibCommon.get_reverse_items( resData.items )
console.log(resData.items );
            var items_all = [];
            var pages_display = 0;
            if(resData.file_version != null){
                if(resData.page_items != null){
                    if(resData.page_items.length > 0){
                        pages_display = 1;
                    }
                }
                items_all = resData.items;
            }else{
                alert("Error, file version can not import, version 2 over require")
            }
            var page_max = LibPaginate.get_max_page(resData.items, this.page_one_max)
            var items = LibPaginate.get_items(resData.items, this.state.page_number , this.page_one_max )
            resData.items = items
            var pagenate_display = 0;
            if(page_max > 1){
                pagenate_display =1;
            }
            this.setState({ 
                data: resData,
                pages_display : pages_display,
                items_all: items_all,
                page_max: page_max,
                pagenate_display: pagenate_display, 
            })

//console.log( data.items )
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    tabRow(){
        if(this.state.data.items instanceof Array){
            var json = JSON.stringify( this.state.data.items );
//console.log( json )
            wasm.wasm_task_disp("div_post_wrap", String(json) );            
            /*
            return this.state.data.items.map(function(object, i){
                console.log(object)
                var json = JSON.stringify( object );
                wasm.wasm_post_row("ul_post_wrap", String(json) );
            })
            */
        }
    }    
    render(){
        $("#div_post_wrap").empty();
        return(
        <div>
            <h1>test</h1>
            <h2>welcome, test2</h2>
            <div id="div_post_wrap">post:
                {this.tabRow()}
            </div>
        </div>
        )
    }
}

export default Test;

