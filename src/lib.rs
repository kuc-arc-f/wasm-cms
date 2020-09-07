mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;
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
        <div>
            <p class='mb-0'>
                <span class='mr-2 time_icon_wrap'><i class='far fa-calendar'></i>
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


