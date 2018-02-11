var db;

(function () {
    db = window.openDatabase("JournalsDB", "1.0", "Ohrgos Database", 60000); //will create database Dummy_DB or open it
    
//    $('.swiper-container').css('width', $(document).width() + 'px');
    if (!db) {
        alert("Невозможно подключится к Базе данных...");
    }
    var journalName = param('journal');
    $('#back_to_list').click(function(){
       location.assign('read.html?journal=' + journalName); 
    });
    var slideStart = param('slide');
    db.transaction(function (tx) {
        var journal_data = 'SELECT user_journals.content, user_journals.introtext, journals.journal_picture, journals.title, user_journals.posttitle FROM user_journals, journals WHERE user_journals.journalId = journals.journal_id AND user_journals.journalId = ?';
        
        tx.executeSql(journal_data, [journalName], function (tx, result) {
            if (result.rows.length > 0) {
                var journal_background = '';
                var journal_title = '';
                
                for (var i = 0; i < result.rows.length; i++) {
                    journal_background = result.rows.item(i)['journal_picture'];
                    journal_title = result.rows.item(i)['title'];
                    
                    $('.swiper-wrapper').append('<div class="swiper-slide"><div class="post_title">' + result.rows.item(i)['posttitle'] + '</div><div class="fulltext">' + ((result.rows.item(i)['content'] === "")?result.rows.item(i)['introtext']:result.rows.item(i)['content']) + '</div><div class="small_bottom"></div></div>');
                }
                
                $('#new_journal_content_read').append('<img src="images/arrow.png" style="position: absolute; top: 42px; left: 20px; z-index: 100;" id="back_to_list" onclick="hideFullJournal();" /><div class="new_journal_block_read" style="background-image: url(' + journal_background + ');"><div class="journal_back"><div class="journal_name_read">' + journal_title + '</div></div></div>');
                
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationType: 'progress',
                    autoHeight: true,
                    initialSlide: slideStart
                });
    
                $('.mobile_main_screen').fadeOut(300, function () {
                    $('.mobile_main_content').fadeIn(300);
                    $('.swiper-container').fadeIn(300);
                });
            } else {
                $('.mobile_main_screen').fadeOut(300, function () {
                    $('.mobile_main_content').fadeIn(300);
                });
            }
        }, function (tx, error) {
            alert(error);
        });
    }, function (tx, error) {

    }, function () {

    });
})();

function param(Name)
{
    var Params = location.search.substring(1).split("&");
    var variable = "";
    for (var i = 0; i < Params.length; i++)
    {
        if (Params[i].split("=")[0] == Name)
        {
            if (Params[i].split("=").length > 1)
                variable = Params[i].split("=")[1];
            return variable;
        }
    }
    return "";
}

