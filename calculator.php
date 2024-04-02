<?php 
use Google\Client;
use Google\Service\Drive;
use Google\Service\Sheets\BatchUpdateSpreadsheetRequest;

add_shortcode('display_offer_maker', 'google_sheets');
function google_sheets($spreadsheetId, $range) {
    ob_start();
    include plugin_dir_path( __FILE__ ) . '/vendor/autoload.php';
    putenv('GOOGLE_APPLICATION_CREDENTIALS='.plugin_dir_path( __FILE__ ).'/api/service-account-creds.json');

    $block_content = '<!-- wp:group  --><div class="wp-block-group"><!-- wp:post-content /--></div><!-- /wp:group -->';
    $client = new Google\Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope(Google\Service\Drive::DRIVE);
    $service = new Google_Service_Sheets($client);

    $result = $service->spreadsheets_values->get('1ivFBZyneEFHflAEdCGKMtf_-dwAAqwNttfBnIivAE68', 'rates_de!A3:D114'); //get($spreadsheetId, $range)
    try {
    $html = '<div id="all-container">
                <div id="form-container">
                    <form name="calc" id="calc">
                        <label for="patient-name">Patient\'s Name</label><br><input type="text" name="patient-name" id="patient-name">
                        <br><br>
                        <label for="discount">Discount? (%)</label><br><input type="number" name="discount" id="discount" value="0" min="1" max="99" step="1">
                        <br><br>
                        <label for="free-form-text">Additional info</label><br><textarea name="free-form-text" id="free-form-text" rows="4" cols="50"></textarea>
                        <br><br>
                        <label for="stages">How many stages?</label><br><input type="number" name="stages" id="stages">
                        <br><br>
                        <label for="the-stage">Select stage</label><br><select disabled id="the-stage" name="the-stage">Select stage</select>';
    $options = '';
    $data = $result->getValues(); // array from google sheets
    $same_category_arrays = []; // we will store multiple arrays for each category
    $index = 0;
    $processedElement = null;
    foreach($data as $key => $value) {
        if ($processedElement != $value[0]) {
            $index++;
        }
        $same_category_arrays[$index][] = $value;
        $processedElement = $value[0];
    }
    foreach($same_category_arrays as $category_array) {
        $html .= '<div class="category-container"><label for="'.$category_array[0][0].'">'.$category_array[0][0].'</label><br><select disabled class="select-service" name="'.$category_array[0][0].'" id="'.$category_array[0][0].'">';
        foreach($category_array as $value ) {
        $category = $value[0]; // category
        $name = $value[1]; // name
        $rate = $value[2]; // rate
        $rack_rate = $value[3]; // rack rate
        $html .= '<option value="'.$name.'" data-category="'.$category.'" data-rate="'.preg_replace('/[^0-9]/', '', $rate).'" data-rack-rate="'.preg_replace('/[^0-9]/', '', $rack_rate).'">'.$name.' ['.$rack_rate.']</strong></option>';
        }
        $html .= '</select></div>';
    }
    $html .= '</form></div>
    <div id="result-container">
        <div class="template-header">
            <div style="text-align: center;"><span class="patient-name-template"></span> / <span>'. date("d.m.Y") .'</span></div>
            <br><br><br>
            <div style="text-align: center;"><img src="/wp-content/plugins/dental-offer-make-google-sheets/teeth1.jpg" /></div>
            <br><br><br>
        </div>
        <div id="tables-container"></div>
        <div id="grand-total"></div>
        <div id="template-box">
        <p class="free-form-text-template"></p>
            '.$block_content.'
        </div>
        <div class="template-footer">
        </div>
    <div id="final-buttons-container">
        <button id="generate-discount" disabled>Generate discount</button>
        <button id="previewBtn">Preview</button>
    </div>
    </div>
    </div>';
    $html .= ob_get_clean();
    return $html;
    // echo '<pre>' . var_export($same_category_arrays, true) . '</pre>';
    // echo '<pre>' . var_export($result->getValues(), true) . '</pre>';
    }
    catch(Exception $e) {
        return 'Message: ' .$e->getMessage();
    }
}
// if(!is_admin()) {
//     google_sheets('1ivFBZyneEFHflAEdCGKMtf_-dwAAqwNttfBnIivAE68', 'rates_de!A3:D114');
// }
// echo $block_content;