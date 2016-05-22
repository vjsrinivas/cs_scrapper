$(document).ready(function() {

    window.sortScore = false;
    window.sortState = false;
    window.sortDivision = false;
    window.sortTier = false;

    var templateScore = String.raw`<div class="label-sort sort-score"><p class="para-sort">Score Range <input type="text" value="(100-300)" id="score-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;
    var templateState = String.raw`<div class="label-sort sort-state"><p class="para-sort">State Filter <input type="text" value="(Tennessee)" id="state-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;
    var templateDivision = String.raw`<div class="label-sort sort-div"><p class="para-sort">Division <input type="text" value="(Open)" id="division-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;
    var templateTier = String.raw`<div class="label-sort sort-tier"><p class="para-sort">Tier <input type="text" value="(Platinum)" style="width: 65px;" id="tier-sort" class="change-value"/></p><i class="material-icons md-24">remove_circle</i></div>`;


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

            if(document.getElementById("tier-sort"))
            {
                $("#sorter-tier").addClass("disabled");
                sortTier = true;
            }
            else
            { $("#sorter-tier").removeClass("disabled"); sortTier = false; }
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
                            if($('#score-sort').val().indexOf("-") != -1)
                            {
                                var trimmed_min = $('#score-sort').val().slice(1, $('#score-sort').val().indexOf("-"))
                                var trimmed_max = $('#score-sort').val().slice($('#score-sort').val().indexOf("-")+1, $("#score-sort").val().length-1)
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
                            else if(isNaN($('#score-sort').val()) && sortScore)
                            {
                                var value_trimmed = $('#score-sort').val().slice(1,$('#score-sort').val().length - 1);
                                var value = parseInt( value_trimmed );

                                var age = parseFloat( data[7] ) || 0; // use data for the age column

                                if ( ( value == age) ||
                                     ( value == age ))
                                {
                                    return true;
                                }
                                return false;
                            }
                        }
                        else
                            return true;
                    }
                );
                maintab.draw();
            }
        });

         $("#sorter-division").off('click').on('click', function() {
            $("#label-container").append(templateDivision);
            sortDivision = true
            if(!$(this).hasClass("disabled"))
            {
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                        if(sortDivision)
                        {
                            var trimmed_val = $('#division-sort').val().slice(1, $('#division-sort').val().length-1)
                            var age = data[4]; // use data for the age column
                            if (trimmed_val == age)
                                return true;
                            return false;
                        }
                        else
                            return true;
                    }
                );
                maintab.draw();
            }
        })

         $("#sorter-location").off('click').on('click', function() {
            $("#label-container").append(templateState);
            sortState = true;
            if(!$(this).hasClass("disabled"))
            {
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                        if(sortState)
                        {
                            var trimmed_val = $('#state-sort').val().slice(1, $('#state-sort').val().length-1)
                            var age = data[3]; // use data for the age column
                            if (trimmed_val == age)
                                return true;
                            return false;
                        }
                        else
                            return true;
                    }
                );
                maintab.draw();
            }
        })

        $("#sorter-tier").off('click').on('click', function() {
            $("#label-container").append(templateTier);
            sortTier = true;
            if(!$(this).hasClass("disabled"))
            {
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                        if(sortTier)
                        {
                            var trimmed_val = $('#tier-sort').val().slice(1, $('#tier-sort').val().length-1)
                            var age = data[5]; // use data for the age column
                            if (trimmed_val == age)
                                return true;
                            return false;
                        }
                        else
                            return true;
                    }
                );
                maintab.draw();
            }
        })
    })
})