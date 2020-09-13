mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;
use serde::{Deserialize, Serialize};
use serde_json::{Value};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-crud-1!");
}

#[wasm_bindgen]
pub fn add(x: i32, y: i32) ->i32{
    return x + y;
}

#[derive(Serialize, Deserialize, Debug)]
struct PostItem {
    id: i64,
    show_id: String,
    title: String,
    content: String,
    created_at: String,
    category_name: String,
}

//
fn convert_struct2str(row : &PostItem) -> String{
    let mut ret : String = String::from("");
    let s_elm = format!("
    <div class='div_post_row_wrap'>
        <a href='#/show/{}'>
            <h3 class='ml-10'>{}</h3>
        </a>
        <div class='div_post_date_wrap'>
            <p class='mb-0'>
                <span class='mr-2 time_icon_wrap'><i class='far fa-calendar'></i></span>
                {} ,
                <span>ID :{}</span>
            </p>
            <span class='folder_icon_wrap mr-2'><i class='fas fa-folder'></i> {}</span>            
        </div>
        <hr class='hr_ex1'>    
    </div>", row.show_id, row.title ,row.created_at ,row.id, row.category_name );
    ret = s_elm.to_string();
    return ret;
}

#[wasm_bindgen]
pub fn wasm_task_disp(id_name: &str, json: &str) -> Result<(), JsValue>{
    let mut s_elm : String = String::from("");
    let deserialized: Vec<PostItem> = serde_json::from_str(json).unwrap();
    for row in &deserialized {
        let s = convert_struct2str( row);
        s_elm.push_str( &s );
//        console::log_1(&JsValue::from_str( &row.category_name ));
    }
    // dom , add
    let document = web_sys::window().unwrap().document().unwrap();
    let entry_point = document.get_element_by_id(id_name).unwrap();
    let val = document.create_element("div")?;
    val.set_inner_html(&s_elm );
    entry_point.append_child(&val)?;

    Ok(())
}

#[wasm_bindgen]
pub fn wasm_post_row(id_name: &str, json: &str) -> Result<(), JsValue>{
    let v: Value = serde_json::from_str( json ).unwrap();
    let tmp_title = v["title"].to_string();
    let title = tmp_title.replace('"', "");
    let tmp_id = v["id"].to_string();
    let id_val = tmp_id.replace('"', "");
    let tmp_show_id = v["show_id"].to_string();
    let show_id_val = tmp_show_id.replace('"', "");
    let tmp_date = v["created_at"].to_string();
    let date_val = tmp_date.replace('"', "");
    let tmp_category = v["category"]["name"].to_string();
    let category_val = tmp_category.replace('"', "");
// console::log_1(&JsValue::from_str( &tmp_category ));

    let document = web_sys::window().unwrap().document().unwrap();
    let entry_point = document.get_element_by_id(id_name).unwrap();
    let val = document.create_element("div")?;
    let s_elm = format!("
        <a href='#/show/{}'>
            <h3 class='ml-10'>{}</h3>
        </a>
        <div class='div_post_date_wrap'>
            <p class='mb-0'>
                <span class='mr-2 time_icon_wrap'><i class='far fa-calendar'></i></span>
                {} ,
                <span>ID :{}</span>
            </p>
            <span class='folder_icon_wrap mr-2'><i class='fas fa-folder'></i> {}</span>
        </div>
        <hr class='hr_ex1'>", show_id_val , title, date_val, id_val, category_val );
    val.set_inner_html(&s_elm );
//    entry_point.set_inner_html(&s_elm );
    entry_point.append_child(&val)?;

    Ok(())
}


