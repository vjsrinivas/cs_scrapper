$(document).ready(function() {

    window.sortScore = false;
    window.sortState = false;
    window.sortDivision = false;

    var templateScore = String.raw`<div class="label-sort"><p class="para-sort">Score Range <input type="text" value="(100-300)" id="score-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;
    var templateState = String.raw`<div class="label-sort"><p class="para-sort">State Filter <input type="text" value="(Tennessee)" id="state-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;
    var templateDivision = String.raw`<div class="label-sort"><p class="para-sort">Division <input type="text" value="(Open)" id="division-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;

    $('a#sort').click(function() {
        if(!$("a#sorter").hasClass("disabled"))
        {
            if(document.getElementById("score-sort"))
            {
                $("#sorter-score").addClass("disabled");
                sortScore = true;
            }
            else
            { $("#sorter-score").removeClass("disabled"); sortScore = false; }

            if(document.getElementById("state-sort"))
            {
                $("#sorter-location").addClass("disabled");
                sortState = true;
            }
            else{ $("#sorter-location").removeClass("disabled"); sortState = false; }

            if(document.getElementById("division-sort"))
            {
                $("#sorter-division").addClass("disabled");
                sortDivision = true;
            }
            else
            { $("#sorter-division").removeClass("disabled"); sortDivision = false; }
        }

        $("#sorter-score").off('click').on('click', function() {
            $("#label-container").append(templateScore);
            sortScore = true;
            if(!$(this).hasClass("disabled"))
            {
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                        if(sortScore)
                        {
                            if($('.change-value').val().indexOf("-") != -1)
                            {
                                var trimmed_min = $('.change-value').val().slice(1, $('.change-value').val().indexOf("-"))
                                var trimmed_max = $('.change-value').val().slice($('.change-value').val().indexOf("-")+1, $(".change-value").val().length-1)
                                var min = parseInt( trimmed_min );
                                var max = parseInt( trimmed_max );

                                if(min > max)
                                {
                                    var temp = min;
                                    min = max;
                                    max = temp;
                                }

                                var age = parseFloat( data[7] ) || 0; // use data for the age column

                                if ( ( isNaN( min ) && isNaN( max ) ) ||
                                     ( isNaN( min ) && age <= max ) ||
                                     ( min <= age   && isNaN( max ) ) ||
                                     ( min <= age   && age <= max ) )
                                {
                                    return true;
                                }
                                return false;
                            }
                        }
                        else if(!isNaN($('.change-value').val()))
                        {
                            System.out.println("afaffa");
                        }
                    }
                );
                maintab.draw();
            }
        });

         $("#sorter-division").off('click').on('click', function() {
            if(!$(this).hasClass("disabled"))
            {
                $("#label-container").append(templateDivision);
                 window.maintab.columns(4).search($("input#division-sort").val().slice(1,$("input#division-sort").val().length-1)).draw();
            }
        })

         $("#sorter-location").off('click').on('click', function() {
            if(!$(this).hasClass("disabled"))
            {
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                            var trimmed_val = $('.change-value').val().slice(1, $('.change-value').val.length-1)

                            var age = data[3]; // use data for the age column

                            if (trimmed_val != "")
                            {
                                return true;
                            }
                            return false;
                    }
                );
                $("#label-container").append(templateState);
                window.maintab.columns(3).search($("input#state-sort").val().slice(1,$("input#state-sort").val().length-1)).draw();
            }
        })
    })
})