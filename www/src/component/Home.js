import React from 'react'
import axios from 'axios';
import $ from  'jquery'
import LibCommon from '../libs/LibCommon';
import LibCmsEdit_3 from '../libs/LibCmsEdit_3';
import LibPaginate from '../libs/LibPaginate';
//import TopPostsRow from './Layouts/TopPostsRow';
import PagesRow from './Layouts/PagesRow';
import TopContent from './Layouts/TopContent';
import * as wasm from "wasm-cms";
//
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '', 
            pages_display:0 ,
            items_all: [],
            page_max : 1,
            page_number : 1,
            pagenate_display: 0,
        }
        this.page_one_max = 20
        this.handleClickCategory = this.handleClickCategory.bind(this);
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleClickPagenate = this.handleClickPagenate.bind(this);
    }  
    componentDidMount(){
        var dt = LibCommon.formatDate( new Date(), "YYYY-MM-DD_hhmmss");
        axios.get('./cms.json?' + dt).then(response => {
            var resData = response.data
            resData.items = LibCommon.get_reverse_items( resData.items )
            var items_all = [];
            var pages_display = 0;
            if(resData.file_version != null){
//console.log(resData.page_items );
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

// console.log( resData.items )
        })
        .catch(function (error) {
            console.log(error)
        })
    }
    handleClickCategory(id){
//        console.log(id)
        var items = LibCmsEdit_3.get_category_data(this.state.items_all ,id)
        var new_data = this.state.data
        new_data.items = items
        this.setState({ data: new_data })
    }
    handleClickMenu(){
//console.log("handleClickMenu")
        $('.btn_hidden_ara_wrap').css('display','inherit');
    }
    categoryRow(){
        if(this.state.data.category_items instanceof Array){
            var self = this
            return this.state.data.category_items.map(function(object, i){
                return (
                <span key={i}>
                    <button  className="btn btn-outline-dark ml-2 mb-2" 
                    onClick={self.handleClickCategory.bind(this, object.save_id)}>
                    {object.name}</button>
                </span>
                )
            })
        }
    }
    categoryDisp(){
        return(
        <div className="category_wrap">
            <div className="row conte mt-2 mb-4">
                <div className="col-sm-12">
                    <h2 className="h4_td_title mt-2" >Category</h2>
                    <div className="category_btn_wrap mb-0">
                        {this.categoryRow()}
                    </div>
                </div>
            </div>

        </div>
        )
    }
    pageRow(){
        return this.state.data.page_items.map(function(object, i){
            return <PagesRow obj={object} key={i} />
        })                            
    }
    pageDisp(){
        if(this.state.data.page_items instanceof Array){
            if(this.state.pages_display ===1 ){
                return(
                <div className="pages_wrap">
                    <div className="row conte mt-2 mb-2">
                        <div className="col-sm-12">
                            <h2 className="h4_td_title mt-2" >Pages</h2>
                            <div className="page_btn_wrap mb-0">
                                {this.pageRow() }
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        }
    }
    tabRow(){
        if(this.state.data.items instanceof Array){
            return this.state.data.items.map(function(object, i){
                var json = JSON.stringify( object );
                wasm.wasm_post_row("div_post_wrap", String(json) )
//                console.log( json )
            })
        }
    }
    handleClickPagenate(){
        var number = this.state.page_number + 1
        var items  = LibPaginate.get_items(
            this.state.items_all, number , this.page_one_max 
        );
        var new_items = LibPaginate.add_page_items(this.state.data.items, items );  
        var new_data = this.state.data
        new_data.items = new_items
        this.setState({ 
            data: new_data ,
            page_number: number
        })
console.log("handleClickPagenate: " + number )
//console.log(new_data.items )
    }
    dispPagenate(){
        if(this.state.pagenate_display ===1){
            return(
            <div className="paginate_wrap">
                <button onClick={this.handleClickPagenate} className="btn btn-lg btn-outline-primary">
                    次ページを読む
                </button>
            </div>
            )
        }
    }
    render(){
//console.log("#-render")
        $("#div_post_wrap").empty();
        return(
        <div className="body_main_wrap">
            <div id="div_img_main2"  className="cover" valign="bottom">
                <div id="div_img_layer">
                    <h1>〇〇 Blog<br />
                    </h1>
                </div>
            </div> 
            <div className="container">
                <TopContent />
                <div className="btn_menu_area_wrap">
                    <div className="row conte mt-2 mb-2" >
                        <a className="ml-4 mt-2 mb-2 menu_display_btn" onClick={this.handleClickMenu}>
                            <i className="fas fa-bars"></i>
                        </a>                
                    </div>
                </div>   
                <div className="btn_hidden_ara_wrap">
                    {this.pageDisp()}
                    {this.categoryDisp() }
                </div>             
                <div className="body_wrap">
                    <div id="post_items_box" className="row conte mt-2 mb-4">
                        <div className="col-sm-12">
                            <div id="div_news">
                                <h2 className="h4_td_title mt-2 mb-2" >New Post</h2>
                            </div>  
                            <div id="div_post_wrap">
                                {this.tabRow()}
                            </div>
                            {this.dispPagenate()}                      
                        </div>
                    </div>
                </div>

            </div>
        </div>
        )
    }
}


export default Home;

