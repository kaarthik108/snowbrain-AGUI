export const DDLData = [
  {
    tableName: "CUSTOMER_DETAILS",
    ddl: `CREATE OR REPLACE TABLE CUSTOMER_DETAILS (
      CUSTOMER_ID NUMBER(38,0) NOT NULL,
      FIRST_NAME VARCHAR(255),
      LAST_NAME VARCHAR(255),
      EMAIL VARCHAR(255),
      PHONE VARCHAR(20),
      ADDRESS VARCHAR(255),
      PRIMARY KEY (CUSTOMER_ID)
    );`,
  },
  {
    tableName: "ORDER_DETAILS",
    ddl: `CREATE OR REPLACE TABLE ORDER_DETAILS (
      ORDER_ID NUMBER(38,0) NOT NULL,
      CUSTOMER_ID NUMBER(38,0),
      ORDER_DATE DATE,
      TOTAL_AMOUNT NUMBER(10,2),
      PRIMARY KEY (ORDER_ID),
      FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMER_DETAILS(CUSTOMER_ID)
    );`,
  },
  {
    tableName: "PAYMENTS",
    ddl: `CREATE OR REPLACE TABLE PAYMENTS (
      PAYMENT_ID NUMBER(38,0) NOT NULL,
      ORDER_ID NUMBER(38,0),
      PAYMENT_DATE DATE,
      AMOUNT NUMBER(10,2),
      PRIMARY KEY (PAYMENT_ID),
      FOREIGN KEY (ORDER_ID) REFERENCES ORDER_DETAILS(ORDER_ID)
    );`,
  },
  {
    tableName: "PRODUCTS",
    ddl: `CREATE OR REPLACE TABLE PRODUCTS (
      PRODUCT_ID NUMBER(38,0) NOT NULL,
      PRODUCT_NAME VARCHAR(255),
      CATEGORY VARCHAR(255),
      PRICE NUMBER(10,2),
      PRIMARY KEY (PRODUCT_ID)
    );`,
  },
  {
    tableName: "TRANSACTIONS",
    ddl: `CREATE OR REPLACE TABLE TRANSACTIONS (
      TRANSACTION_ID NUMBER(38,0) NOT NULL,
      ORDER_ID NUMBER(38,0),
      PRODUCT_ID NUMBER(38,0),
      QUANTITY NUMBER(38,0),
      PRICE NUMBER(10,2),
      PRIMARY KEY (TRANSACTION_ID),
      FOREIGN KEY (ORDER_ID) REFERENCES ORDER_DETAILS(ORDER_ID),
      FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)
    );`,
  },
];
