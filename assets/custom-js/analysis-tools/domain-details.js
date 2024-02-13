"use strict";


$('.reservation').daterangepicker();
$(".reservation").val('');

var function_name='traffic_source';
var first_load = 1;

$("document").ready(function(){
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        e.preventDefault();
        first_load = 0;
        var target = $(e.target).attr("href");
        function_name = target.replace('#','');
        ajax_call(function_name);		

    }); // end of $('a[data-toggle="tab"]')


    $(document.body).on('click','.search_button',function(){
        ajax_call(function_name);			
    });

    if(function_name == 'traffic_source' && first_load == 1){
        ajax_call(function_name);
    }


    function ajax_call(function_name)
    {
        var domain_id = $("#domain_id").val();
        var date_range = $("#"+function_name+"_date").val();

        if(function_name == 'visitor_analysis')
            date_range = $("#overview_date").val();

        
        var data_type = "JSON";
        if(function_name == 'alexa_info' || function_name == 'general' || function_name == 'similarweb_info')
            data_type = '';
        $('#'+function_name+'_success_msg').html('<img class="center-block" style="margin-top:10px;" src="'+pre_loader+'" alt="Searching...">');

        $.ajax({
            type: "POST",
            url : 'ajax_get_'+function_name+'_data',
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
            },
            data:{domain_id:domain_id,date_range:date_range},
            dataType: data_type,
            async: true,
            success:function(response){
                $('#'+function_name+'_success_msg').html('');
                $("#"+function_name+"_name").html(response);
                $(".domain_name").text(response.domain_name);


                /***************** overview page ******************/
                if (function_name == 'overview') {
                    $('#overview_from_date').text(response.from_date);
                    $('#overview_to_date').text(response.to_date);

                    var overview_data = document.getElementById("line-chart").getContext('2d');
                    var overview_data_chart = new Chart(overview_data, {
                      type: 'line',
                      data: {
                        labels: response.line_chart_dates,
                        datasets: [{
                          label: New_User,
                          data: response.line_chart_values,
                          borderWidth: 1,
                          borderColor: '#36a2eb',
                          backgroundColor: 'transparent',
                          pointBackgroundColor: '#fff',
                          pointBorderColor: '#36a2eb',
                          pointRadius: 2
                        }]
                      },
                      options: {
                        legend: {
                          display: false
                        },
                        scales: {
                          yAxes: [{
                            gridLines: {
                              display: false,
                              drawBorder: false,
                            },
                            ticks: {
                              stepSize: response.step_count
                            }
                          }],
                          xAxes: [{
                            gridLines: {
                              color: '#fbfbfb',
                              lineWidth: 2
                            },
                            type: 'time',
                               time: {

                                   displayFormats: {
                                       quarter: 'MMM YYYY'
                                   }
                               },
                          }],

                        },
                      }
                    });

                    $('#total_page_view').text(response.total_page_view);
                    $('#total_unique_visitor').text(response.total_unique_visitor);
                    $('#average_stay_time').text(response.average_stay_time);
                    $('#average_visit').text(response.average_visit);
                    $("#bounce_rate").text(response.bounce_rate);
                }
                /********************* end of overview page *****************/


                /******************** for traffic source page *******************/ 
                if(function_name=='traffic_source') {
                    
                    $('#traffic_source_from_date').text(response.from_date);
                    $('#traffic_source_to_date').text(response.to_date);
                    /*** daily traffic line chart ***/

                    var traffic_line_chart_data = document.getElementById("traffic_line-chart").getContext('2d');
                    var traffic_line_chart_data_preview = new Chart(traffic_line_chart_data, {
                      type: 'line',
                      data: {
                        labels: response.traffic_line_chart_dates,
                        datasets: [{
                          label: Direct_Link,
                          data: response.traffic_direct_link,
                          borderColor: 'transparent',
                          backgroundColor: '#99CC99',
                          pointBackgroundColor: 'transparent',
                          pointHoverBackgroundColor: 'transparent'
                        },
                        {
                          label: Search_Engine,
                          data: response.traffic_search_link,
                          borderColor: 'transparent',
                          backgroundColor: '#FFFFCC',
                          pointBackgroundColor: 'transparent',
                          pointHoverBackgroundColor: 'transparent'
                        },
                        {
                          label: Social_Network,
                          data: response.traffic_social_link,
                          borderColor: 'transparent',
                          backgroundColor: '#9999CC',
                          pointBackgroundColor: 'transparent',
                          pointHoverBackgroundColor: 'transparent'
                        },
                        {
                          label: Referal,
                          data: response.traffic_referrer_link,
                          borderColor: 'transparent',
                          backgroundColor: '#CCCC99',
                          pointBackgroundColor: 'transparent',
                          pointHoverBackgroundColor: 'transparent'
                        }]
                      },
                      options: {
                        legend: {
                          display: false
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        maintainAspectRatio: false,
                        elements: {
                            line: {
                                tension: 0.5
                            }
                        },
                        scales: {
                            yAxes: [{
                                stacked: true,
                                gridLines: {
                                  display: false,
                                  drawBorder: false,
                                },
                                ticks: {
                                  beginAtZero: true,
                                  stepSize: response.traffic_daily_line_step_count
                                }

                            }],
                            xAxes: [{
                              gridLines: {
                                color: '#fbfbfb',
                                lineWidth: 1
                              },
                              type: 'time',
                                 time: {
                                         
                                     displayFormats: {
                                         quarter: 'MMM YYYY'
                                     }
                                 },

                            }]
                        },
                        plugins: {
                            filler: {
                                propagate: true
                            },

                        }
                      }
                    });

                    /****************************/

                    var traffic_bar_chart_data = document.getElementById("traffic_bar_chart").getContext('2d');
                    var traffic_bar_chart_data_preview = new Chart(traffic_bar_chart_data, {
                        type: 'bar',
                        data: {
                                labels: ['Visitor'],
                                datasets: [{
                                    label: 'Direct Link',
                                    backgroundColor: '#FF9966',
                                    borderColor: '#FF9966',
                                    borderWidth: 1,
                                    data: [response.traffic_bar_direct_link_count]
                                }, {
                                    label: 'Search Engine',
                                    backgroundColor: '#FFCC99',
                                    borderColor: '#FFCC99',
                                    borderWidth: 1,
                                    data: [response.traffic_bar_search_link_count]
                                },{
                                    label: 'Social Network',
                                    backgroundColor: '#3399FF',
                                    borderColor: '#3399FF',
                                    borderWidth: 1,
                                    data: [response.traffic_bar_social_link_count]
                                },{
                                    label: 'Referal',
                                    backgroundColor: '#003366',
                                    borderColor: '#003366',
                                    borderWidth: 1,
                                    data: [response.traffic_bar_referrer_link_count]
                                }]

                            },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                                text: 'Chart.js Bar Chart'
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                      beginAtZero: true,
                                      stepSize: response.traffic_bar_step_count
                                    }
                                }]
                            }
                        }
                    });
                    /******************************/

                    var top_referrer_chart_data = document.getElementById("top_referrer_chart").getContext('2d');
                    var top_referrer_chart_data_preview = new Chart.PolarArea(top_referrer_chart_data, {
                      data: {
                          datasets: [{
                              data: response.top_referrer_present_value,
                              backgroundColor: [
                                  'red',
                                  'orange',
                                  'yellow',
                                  'green',
                                  'purple',
                              ],
                              label: 'My dataset' // for legend
                          }],
                          labels: response.top_referrer_present_label
                          },
                          options: {
                              responsive: true,
                              legend: {
                                  position: 'right',
                              },
                              title: {
                                  display: true,
                                  text: Top_five_referrers_in_percentage
                              },
                              scale: {
                                  ticks: {
                                      beginAtZero: true
                                  },
                                  reverse: false
                              },
                              animation: {
                                  animateRotate: false,
                                  animateScale: true
                              }
                          }
                      
                    });


                    var search_enginge_traffic_data = document.getElementById("search_enginge_traffic").getContext('2d');
                    var search_enginge_traffic_data_preview = new Chart(search_enginge_traffic_data, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: response.search_engine_values,
                                backgroundColor: response.search_engine_colors,
                                label: 'Dataset 1'
                            }],
                            labels: response.search_engine_labels
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                text: Visitors_from_different_search_engine
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }
                    });

                    /*****************************************/
                    var social_network_traffic_data = document.getElementById("social_network_traffic").getContext('2d');
                    var social_network_traffic_data_preview = new Chart(social_network_traffic_data, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: response.social_network_values,
                                backgroundColor: response.social_network_colors,
                                label: 'Dataset 1'
                            }],
                            labels: response.social_network_labels
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                text: Visitors_from_different_social_networks
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            },
                            rotation: 1 * Math.PI,
                             circumference: 1 * Math.PI
                        }
                    });

                }
                
                /****************** end of traffic source page ***********************/



                /****************** for visitor type page ****************************/
                if(function_name == 'visitor_type'){
                    $('#visitor_type_from_date').text(response.from_date);
                    $('#content_overview_from_date').text(response.from_date);
                    $('#visitor_type_to_date').text(response.to_date);
                    $('#content_overview_to_date').text(response.to_date);
                    $("#content_overview_data").html(response.progress_bar_data);
                    
                    var visitor_type_bar_chart_data = document.getElementById("visitor_type_bar_chart").getContext('2d');
                    var visitor_type_bar_chart_data_preview = new Chart(visitor_type_bar_chart_data, {
                        type: 'bar',
                        data: {
                                labels: response.new_vs_returning_dates,
                                datasets: [{
                                    label: New_User,
                                    backgroundColor: '#2F4E6F',
                                    borderColor: '#2F4E6F',
                                    borderWidth: 1,
                                    data: response.new_vs_returning_new_user
                                }, {
                                    label: Returning_User,
                                    backgroundColor: '#E15119',
                                    borderColor: '#E15119',
                                    borderWidth: 1,
                                    data: response.new_vs_returning_returning_user
                                }]

                            },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                                text: 'Chart.js Bar Chart'
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                      beginAtZero: true,
                                      stepSize: response.new_vs_returning_step_count
                                    }
                                }]
                            }
                        }
                    });

                    var visitor_type_pieChart_data = document.getElementById("visitor_type_pieChart").getContext('2d');
                    var visitor_type_pieChart_data_preview = new Chart.PolarArea(visitor_type_pieChart_data, {
                      data: {
                          datasets: [{
                              data: response.total_new_returning_values,
                              backgroundColor: [
                                  '#C8EBE5',
                                  '#F5A196',
                              ],
                              label: 'My dataset' // for legend
                          }],
                          labels: response.total_new_returning_labels
                          },
                          options: {
                              responsive: true,
                              legend: {
                                  position: 'right',
                              },
                              title: {
                                  display: false,
                                  text: Top_five_referrers_in_percentage,
                              },
                              scale: {
                                  ticks: {
                                      beginAtZero: true
                                  },
                                  reverse: false
                              },
                              animation: {
                                  animateRotate: false,
                                  animateScale: true
                              }
                          }
                      
                    });

                }
                /****************** end of visitor type page *************************/



                /************************ content over view page********************************/
                if(function_name == 'content_overview'){
                    $('#content_overview_from_date').text(response.from_date);
                    $('#content_overview_to_date').text(response.to_date);
                    $('#content_overview_data').html(response.progress_bar_data);
                }
                /************************ end content over view page********************************/

                /**************** country wise report page ********************/
                if(function_name == 'country_wise_report'){
                    $("#country_wise_visitor_from_date").text(response.from_date);
                    $("#country_wise_visitor_to_date").text(response.to_date);
                    $("#country_wise_table_data").html(response.country_wise_table_data);
                    
                    google.charts.load('current', {
                          'packages':['geochart']
                         
                        });
                    google.charts.setOnLoadCallback(drawRegionsMap);

                    function drawRegionsMap() {
                       var data = google.visualization.arrayToDataTable(response.country_graph_data);
                       var options = {};
                       var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
                       chart.draw(data, options);
                    }
                }
                /**************** end country wise report page ********************/

                if(function_name == 'browser_report'){
                    $("#browser_table_from_date").text(response.from_date);
                    $("#browser_table_to_date").text(response.to_date);
                    $("#browser_report_name").html(response.browser_report_name);
                }

                if(function_name == 'os_report'){
                    $("#os_table_from_date").text(response.from_date);
                    $("#os_table_to_date").text(response.to_date);
                    $("#os_report_name").html(response.os_report_name);
                }

                if(function_name == 'device_report'){
                    $("#device_table_from_date").text(response.from_date);
                    $("#device_table_to_date").text(response.to_date);
                    $("#device_report_name").html(response.device_report_name);
                }
                
            } //end of success

        }); // end of ajax
    } //end of function ajax_call



    $(document.body).on('click','.browser_name',function(){
        var domain_id = $("#domain_id").val();
        var browser_name = $(this).attr("data");
        var date_range = $("#browser_report_date").val();
        $("#individual_browser_data_table").html('');
        $("#id_for_browser_name").text(browser_name);
        $("#modal_for_browser_report").modal();
        $('#modal_waiting_browser_name').html('<div class="text-center waiting"><i class="fas fa-spinner fa-spin blue text-center" style="font-size: 40px;"></i></div>');

        $.ajax({
            type: "POST",
            url : ajax_get_individual_browser_data,
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
            },
            data:{domain_id:domain_id,date_range:date_range,browser_name:browser_name},
            dataType: 'JSON',
            async: false,
            success:function(response){
                $("#modal_waiting_browser_name").html('');
                $("#browser_name_from_date").text(response.from_date);
                $("#browser_name_to_date").text(response.to_date);
                $("#individual_browser_data_table").html(response.browser_version);
                
                var browser_name_line_chart_data = document.getElementById("browser_name_line_chart").getContext('2d');
                var browser_name_line_chart_data_preview = new Chart(browser_name_line_chart_data, {
                  type: 'line',
                  data: {
                    labels: response.browser_daily_session_dates,
                    datasets: [{
                      label: Sessions,
                      data: response.browser_daily_session_values,
                      borderWidth: 1,
                      borderColor: 'red',
                      borderDash: [5, 5],
                      backgroundColor: 'transparent',
                      pointBackgroundColor: '#fff',
                      pointBorderColor: 'red',
                      pointRadius: 2
                    }]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          stepSize: response.browser_daily_session_steps
                        }
                      }],
                      xAxes: [{
                        gridLines: {
                          color: '#fbfbfb',
                          lineWidth: 2
                        },
                        type: 'time',
                           time: {

                               displayFormats: {
                                   quarter: 'MMM YYYY'
                               }
                           },
                      }],

                    },
                  }
                });

            } //end of success
        });
    }); // end of browser name click function



    $(document.body).on('click','.os_name',function(){
        var domain_id = $("#domain_id").val();
        console.log('hi');
        var os_name = $(this).attr("data");
        var date_range = $("#os_report_date").val();
        $("#id_for_os_name").text(os_name);
        $("#modal_for_os_report").modal();
        $('#modal_waiting_os_name').html('<div class="text-center waiting"><i class="fas fa-spinner fa-spin blue text-center" style="font-size: 40px;"></i></div>');

        $.ajax({
            type: "POST",
            url : ajax_get_individual_os_data,
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
            },
            data:{domain_id:domain_id,date_range:date_range,os_name:os_name},
            dataType: 'JSON',
            async: false,
            success:function(response){
                $("#modal_waiting_os_name").html('');
                $("#os_name_from_date").text(response.from_date);
                $("#os_name_to_date").text(response.to_date);
                
                var os_name_line_chart_data = document.getElementById("os_name_line_chart").getContext('2d');
                var os_name_line_chart_data_preview = new Chart(os_name_line_chart_data, {
                  type: 'line',
                  data: {
                    labels: response.os_daily_session_dates,
                    datasets: [{
                      label: Sessions,
                      data: response.os_daily_session_values,
                      borderWidth: 1,
                      borderColor: '#00AAA0',
                      borderDash: [5, 5],
                      backgroundColor: 'transparent',
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#00AAA0',
                      pointRadius: 2
                    }]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          stepSize: response.os_daily_session_steps
                        }
                      }],
                      xAxes: [{
                        gridLines: {
                          color: '#fbfbfb',
                          lineWidth: 2
                        },
                        type: 'time',
                           time: {

                               displayFormats: {
                                   quarter: 'MMM YYYY'
                               }
                           },
                      }],

                    },
                  }
                });					
            } //end of success
        });
    }); //end of os name click function



    $(document.body).on('click','.device_name',function(){
        var domain_id = $("#domain_id").val();
        var device_name = $(this).attr("data");
        var date_range = $("#device_report_date").val();
        $("#id_for_device_name").text(device_name);
        $("#modal_for_device_report").modal();
        $('#modal_waiting_device_name').html('<div class="text-center waiting"><i class="fas fa-spinner fa-spin blue text-center" style="font-size: 40px;"></i></div>');

        $.ajax({
            type: "POST",
            url : ajax_get_individual_device_data,
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
            },
            data:{domain_id:domain_id,date_range:date_range,device_name:device_name},
            dataType: 'JSON',
            async: false,
            success:function(response){
                $("#modal_waiting_device_name").html('');
                $("#device_name_from_date").text(response.from_date);
                $("#device_name_to_date").text(response.to_date);
                
                var device_name_line_chart_data = document.getElementById("device_name_line_chart").getContext('2d');
                var device_name_line_chart_data_preview = new Chart(device_name_line_chart_data, {
                  type: 'line',
                  data: {
                    labels: response.device_daily_session_dates,
                    datasets: [{
                      label: Sessions,
                      data: response.device_daily_session_values,
                      borderWidth: 1,
                      borderColor: '#FF7A5A',
                      borderDash: [5, 5],
                      backgroundColor: 'transparent',
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#FF7A5A',
                      pointRadius: 2
                    }]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          stepSize: response.device_daily_session_steps
                        }
                      }],
                      xAxes: [{
                        gridLines: {
                          color: '#fbfbfb',
                          lineWidth: 2
                        },
                        type: 'time',
                           time: {

                               displayFormats: {
                                   quarter: 'MMM YYYY'
                               }
                           },
                      }],

                    },
                  }
                });						
            } //end of success
        });
    }); //end of device name click function


    $(document.body).on('click','.country_wise_name',function(){
        var domain_id = $("#domain_id").val();
        var country_name = $(this).attr("data");
        var date_range = $("#country_wise_report_date").val();
        $("#individual_country_data_table").html('');
        $("#id_for_country_name").text(country_name);
        $("#modal_for_country_report").modal();
        $('#modal_waiting_country_name').html('<div class="text-center waiting"><i class="fas fa-spinner fa-spin blue text-center" style="font-size: 40px;"></i></div>');

        $.ajax({
            type: "POST",
            url : ajax_get_individual_country_data,
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
            },
            data:{domain_id:domain_id,date_range:date_range,country_name:country_name},
            dataType: 'JSON',
            async: false,
            success:function(response){
                $("#modal_waiting_country_name").html('');
                $("#country_name_from_date").text(response.from_date);
                $("#country_name_to_date").text(response.to_date);
                $("#individual_country_data_table").html(response.country_city_str);
                
                var country_name_line_chart_data = document.getElementById("country_name_line_chart").getContext('2d');
                var country_name_line_chart_data_preview = new Chart(country_name_line_chart_data, {
                  type: 'line',
                  data: {
                    labels: response.country_daily_session_dates,
                    datasets: [{
                      label: Sessions,
                      data: response.country_daily_session_values,
                      borderWidth: 1,
                      borderColor: 'red',
                      backgroundColor: 'transparent',
                      pointBackgroundColor: '#fff',
                      pointBorderColor: 'red',
                      pointRadius: 2
                    }]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          stepSize: response.country_daily_session_steps
                        }
                      }],
                      xAxes: [{
                        gridLines: {
                          color: '#fbfbfb',
                          lineWidth: 2
                        },
                        type: 'time',
                           time: {

                               displayFormats: {
                                   quarter: 'MMM YYYY'
                               }
                           },
                      }],

                    },
                  }
                });

            } //end of success
        });
    }); // end of browser name click function


});