function dataUpdating_IGT() {
  var sheetInterface = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    `${interfaceSheetName}`
  ); // write sheet name
  var sheetIGT = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`IGTa/e`); // write sheet name
  var startDate = Utilities.formatDate(
    sheetInterface.getRange(16, 2).getValue(),
    "GMT+2",
    "dd/MM/yyyy"
  );

  var page_number = 1;
  var allData = [];
  try {
    do {
      var queryApplications = `
{
    allOpportunityApplication(
        filters: {
            sort: created_at
            opportunity_home_mc: 1609
            programmes: [8, 9]
            created_at: { from:\"${startDate}\"}
        }
        page: ${page_number}
        per_page: 50
    ) {
        data {
            id
            person {
                created_at
                full_name
                id
                contact_detail {
                    phone
                }
                home_lc {
                    name
                }
                home_mc {
                    name
                }
                cv_url
            }
            opportunity {
                id
                title
                programme {
                    short_name_display
                }
                opportunity_duration_type {
                    duration_type
                }
                sub_product {
                    name
                }
            }
            created_at
            date_matched
            date_approved
            date_approval_broken
            date_realized
            experience_end_date
            status
            host_lc_name
            home_mc {
                name
            }
        }
    }
}

`;
      var query = JSON.stringify({ query: queryApplications });
      var data = dataExtraction(query);
      if (data.length != 0) allData.push(data);
      page_number++;
    } while (data.length != 0);

    Logger.log(allData);
    var ids = sheetIGT.getRange(1, 1, sheetIGT.getLastRow(), 1).getValues();
    var ids = ids.flat(1);
    var newRows = [];
    for (let data of allData) {
      for (let i = 0; i < data.length; i++) {
        Logger.log(i);

        var index = ids.indexOf(parseInt(data[i].id));
        if (index < 0) {
          Logger.log("new");
          newRows.push([
            data[i].id ? data[i].id : "",
            data[i].person ? data[i].person.full_name : "",
            data[i].person.contact_detail
              ? data[i].person.contact_detail.phone
              : "",
            data[i].person ? data[i].person.id : "",
            data[i].opportunity ? data[i].opportunity.id : "",
            data[i].opportunity ? data[i].opportunity.title : "",
            data[i].person.home_lc.name,
            data[i].person.home_mc.name,
            data[i].opportunity.programme
              ? data[i].opportunity.programme.short_name_display
              : "",
            data[i].status ? data[i].status : "",
            data[i].host_lc_name,
            data[i].home_mc.name,
            data[i].person.cv_url ? data[i].person.cv_url : "-",
            data[i].person.created_at.toString().substring(0, 10),
            data[i].created_at.toString().substring(0, 10),
            data[i].date_matched != null
              ? data[i].date_matched.toString().substring(0, 10)
              : "",
            data[i].date_approved != null
              ? data[i].date_approved.toString().substring(0, 10)
              : "",
            data[i].date_realized != null
              ? data[i].date_realized.toString().substring(0, 10)
              : "",
            data[i].experience_end_date != null
              ? data[i].experience_end_date.toString().substring(0, 10)
              : "",
            data[i].opportunity.opportunity_duration_type.duration_type
              ? data[i].opportunity.opportunity_duration_type.duration_type
              : "-",
            data[i].opportunity.sub_product != null
              ? data[i].opportunity.sub_product.name
              : "GTe",
          ]);
        } else {
          Logger.log("old");
          var row = [];
          row.push([
            data[i].id ? data[i].id : "",
            data[i].person ? data[i].person.full_name : "",
            data[i].person.contact_detail
              ? data[i].person.contact_detail.phone
              : "",
            data[i].person ? data[i].person.id : "",
            data[i].opportunity ? data[i].opportunity.id : "",
            data[i].opportunity ? data[i].opportunity.title : "",
            data[i].person.home_lc.name,
            data[i].person.home_mc.name,
            data[i].opportunity.programme
              ? data[i].opportunity.programme.short_name_display
              : "",
            data[i].status ? data[i].status : "",
            data[i].host_lc_name,
            data[i].home_mc.name,
            data[i].person.cv_url ? data[i].person.cv_url : "-",
            data[i].person.created_at.toString().substring(0, 10),
            data[i].created_at.toString().substring(0, 10),
            data[i].date_matched != null
              ? data[i].date_matched.toString().substring(0, 10)
              : "",
            data[i].date_approved != null
              ? data[i].date_approved.toString().substring(0, 10)
              : "",
            data[i].date_realized != null
              ? data[i].date_realized.toString().substring(0, 10)
              : "",
            data[i].experience_end_date != null
              ? data[i].experience_end_date.toString().substring(0, 10)
              : "",
            data[i].opportunity.opportunity_duration_type.duration_type
              ? data[i].opportunity.opportunity_duration_type.duration_type
              : "-",
            data[i].opportunity.sub_product != null
              ? data[i].opportunity.sub_product.name
              : "GTe",
          ]);
          sheetIGT.getRange(index + 1, 1, 1, row[0].length).setValues(row);
        }
      }
    }
    if (newRows.length > 0) {
      sheetIGT
        .getRange(
          sheetIGT.getLastRow() + 1,
          1,
          newRows.length,
          newRows[0].length
        )
        .setValues(newRows);
    }

    sheetInterface.getRange(16, 3).setValue("Succeeded");
    sheetInterface.getRange(16, 4).setValue(new Date());
  } catch (e) {
    console.log(e.toString());
    sheetInterface.getRange(16, 3).setValue("Failed");
    sheetInterface.getRange(16, 4).setValue(new Date());
  }
}
