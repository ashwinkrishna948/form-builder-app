export const schema = {
    "title": "Group Structure",
    "description": "Group Component Structure",
    "required": [ "name", "type"],
    "type": "object",
    "minProperties": 2,
    "properties": {
        "name": { "type": "string", "minLength": 2 }, 
        "label": { "type": "string", "minLength": 2 },
        "bind":{"type":"object", 
                "properties":{
                    "required": { "type": "string" , "enum": ["true", "false"]},
                    "calculate" : {"type": "string"},
                    "relevant" : {"type": "string"},
                    "read-only" : {"type": "string"},
                    "constraint" : {"type": "string"},
                }
               },
        "type": { "type": "string", "enum": ["text","number","group","repeat-group","select_one","select_many","phone","decimal","integer",
                                            "date","time","point","photo","audio","video","line","note","barcode",
                                            "acknowledge","area","rating","Question_Matrix","ranking","calculate"]},
        "itemset" : {"type": "string"},
        "cascade" : {"type": "string"},
        "default" : {"type": "string"},
        "choice_filter" : {"type": "string"},
        "editable" : {"type": "boolean"},
        "isSelect" : {"type": "string"},
        "searchable" : {"type": "boolean"},
      }
  }
