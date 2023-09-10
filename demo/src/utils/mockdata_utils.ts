export class MockDataUtils {
  //mocked data   
  /*the data must be nested. Then it can have different properties, the schema will map them */
  public static mockedData1 = [

    {
      status: "CREATED", fooId: "1", children:
        [
          {
            status: "CREATED", fooId: "2", children:
              [
                {
                  status: "CREATED", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },
                      { status: "COMPLETED_ERROR", fooId: "5" }
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "RUNNING", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "7" },
          {
            status: "STOPPED", fooId: "8", children:
              [
                {
                  status: "STOPPED", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },
                      { status: "COMPLETED_ERROR", fooId: "11" }
                    ]
                }
              ]
          }
        ]
    }
  ];


  public static mockedData1_differentstatus = [

    {
      status: "COMPLETED_SUCCESS", fooId: "1", children:
        [
          {
            status: "COMPLETED_SUCCESS", fooId: "2", children:
              [
                {
                  status: "COMPLETED_SUCCESS", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },
                      { status: "COMPLETED_ERROR", fooId: "5" }
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "7" },
          {
            status: "RUNNING", fooId: "8", children:
              [
                {
                  status: "COMPLETED_ERROR", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },
                      { status: "COMPLETED_ERROR", fooId: "11" }
                    ]
                }
              ]
          }
        ]
    }
  ];


  //multiple fathers for the same node (a node is present on multiple paths)
  public static mockedDataMultipleFathers = [

    {
      status: "COMPLETED_SUCCESS", fooId: "1", children:
        [
          {
            status: "COMPLETED_SUCCESS", fooId: "2", children:
              [
                {
                  status: "COMPLETED_SUCCESS", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },
                      {
                        status: "COMPLETED_ERROR", fooId: "5",
                        children:
                          [
                            { status: "COMPLETED_SUCCESS", fooId: "10" }
                          ]
                      }
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "4" },
          { status: "COMPLETED_SUCCESS", fooId: "7" },
          {
            status: "RUNNING", fooId: "8", children:
              [
                {
                  status: "COMPLETED_ERROR", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },
                      { status: "COMPLETED_ERROR", fooId: "11" }
                    ]
                }
              ]
          }
        ]
    }

  ];


  //different nodes
  public static mockedData3 = [

    { //1 root node (lvl 0) , path A
      status: "COMPLETED_SUCCESS", fooId: "2sd", children:
        [
          { // 1 child (lvl1), path A->B
            status: "RUNNING", fooId: "dax", children:
              [
                { //1 child (lvl2) , path A-B-C
                  status: "RUNNING", fooId: "111"
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "aaa", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "kdj" }, //1 child (lvl1) , path A1->B1
          { status: "COMPLETED_SUCCESS", fooId: "kdj" }, //2 child (lvl1), path A1->C1
          {                                                  //3 child (lvl1) , path A1->D1
            status: "COMPLETED_ERROR", fooId: "bbb", children:
              [
                {                                               //1 child (lvl2) , path A1->D1->E1
                  status: "CREATED", fooId: "ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "ddd" }, //1 child (lvl3), path A1->D1->E1->F1
                      { status: "COMPLETED_SUCCESS", fooId: "eee" } //2 child (lvl3), path A1->D1->E1->G1
                    ]
                },
                {                                             //2 child (lvl2) path A1->D1->H1
                  status: "CREATED", fooId: "ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "ddd" }, //1 child (lvl 3), path A1->D1->H1->I1
                      { status: "COMPLETED_ERROR", fooId: "eee" } //2 child (lvl 4), path A1->D1->H1->L1
                    ]
                }
              ]
          }
        ]
    }
  ];


  

  
  public static mockedData8 = [

    {
      status: "CREATED", fooId: "1", fooPayload : {foo: "FOO1", bar: "BAR1"} ,children:
        [
          {
            status: "CREATED", fooId: "2", fooPayload : {foo: "FOO2", bar: "BAR2"},children:
              [
                {
                  status: "CREATED", fooId: "3",fooPayload : {foo: "FOO3", bar: "BAR3"}, children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" ,fooPayload : {foo: "FOO4", bar: "BAR4"}},
                      { status: "COMPLETED_ERROR", fooId: "5",fooPayload : {foo: "FOO5", bar: "BAR5"} }
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "RUNNING", fooId: "6", fooPayload : {foo: "FOO6", bar: "BAR6"},children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "7",fooPayload : {foo: "FOO7", bar: "BAR7"} },
          {
            status: "STOPPED", fooId: "8",fooPayload : {foo: "FOO8", bar: "BAR8"}, children:
              [
                {
                  status: "STOPPED", fooId: "9", fooPayload : {foo: "FOO9", bar: "BAR9"},children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10",fooPayload : {foo: "FOO10", bar: "BAR10"} },
                      { status: "COMPLETED_ERROR", fooId: "11",fooPayload : {foo: "FOO11", bar: "BAR11"} }
                    ]
                }
              ]
          }
        ]
    }
  ];


  public static mockedData9 = [

    {
      type: "PERSON", typeId: "1", typeName :"PERSON TYPE" ,subTypes:
        [
          {
            type: "STUDENT", typeId: "2", typeName :"STUDENT SUB-TYPE", subTypes:
              [

                { type: "MASTER", typeId: "3", typeName :"MASTER SUB-SUB-TYPE" },
                { type: "BACHELOR", typeId: "4", typeName :"BACHELOR SUB-SUB-TYPE" }

              ]
          }
        ]
    },
    {
      type: "EMPLOYEE", typeId: "5",  typeName :"EMPLOYEE TYPE", subTypes:
        [
          {
            type: "MANAGER", typeId: "6", typeName : "MANAGER SUB-TYPE", subTypes:
              [

                { type: "TASKMANAGER",typeId: "7", typeName: "TASK MANAGER SUB-SUB-TYPE"  }

              ]
          }
        ]
    }
     
  ];
}