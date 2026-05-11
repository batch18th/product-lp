import type { OrderRecord } from "./order";

type SheetsClient = {
  spreadsheets: {
    get: (params: Record<string, unknown>) => Promise<{
      data: {
        sheets?: Array<{
          properties?: {
            title?: string;
            sheetId?: number | null;
          };
        }>;
      };
    }>;
    batchUpdate: (params: Record<string, unknown>) => Promise<{
      data: {
        replies?: Array<{
          addSheet?: {
            properties?: {
              sheetId?: number | null;
            };
          };
        }>;
      };
    }>;
    values: {
      get: (params: Record<string, unknown>) => Promise<{
        data: {
          values?: string[][];
        };
      }>;
      update: (params: Record<string, unknown>) => Promise<unknown>;
      append: (params: Record<string, unknown>) => Promise<{
        data: {
          spreadsheetId?: string;
          tableRange?: string;
          updates?: {
            updatedRange?: string;
            updatedRows?: number;
            updatedColumns?: number;
            updatedCells?: number;
          };
        };
      }>;
    };
  };
};

type BatchUpdateRequest = Record<string, unknown>;

const columns = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes",
];

const orderStatusOptions = [
  "New Order",
  "Order Confirmed",
  "Order Ongoing",
  "Delivered",
  "Cancelled",
];

export async function appendOrderToSheet(order: OrderRecord) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "T-shirt order";

  console.info("[Google Sheets] Spreadsheet ID:", sheetId || "(missing)");
  console.info("[Google Sheets] Sheet tab name:", tabName);
  console.info("[Google Sheets] Service account email:", serviceAccountEmail || "(missing)");

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    throw new Error(
      "Google Sheets credentials are missing. Add GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY.",
    );
  }

  const sheets = await createSheetsClient(serviceAccountEmail, privateKey);
  const numericSheetId = await ensureSheetExists(sheets, sheetId, tabName);
  const quotedTabName = quoteSheetName(tabName);
  const row = [
    order.orderId,
    order.dateTime,
    order.customerName,
    order.phone,
    order.email,
    order.location,
    order.productName,
    order.quantity,
    order.pricePerPiece,
    order.totalPrice,
    order.paymentMethod,
    order.orderStatus,
    order.notes,
  ];

  await ensureHeaderRow(sheets, sheetId, quotedTabName);
  await safelyApplyPremiumSheetLayout(sheets, sheetId, tabName, numericSheetId);

  console.info("[Google Sheets] Appending row:", JSON.stringify(row));

  try {
    const response = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${quotedTabName}!A:M`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

    console.info(
      "[Google Sheets] Append response:",
      JSON.stringify({
        spreadsheetId: response.data.spreadsheetId,
        tableRange: response.data.tableRange,
        updatedRange: response.data.updates?.updatedRange,
        updatedRows: response.data.updates?.updatedRows,
        updatedColumns: response.data.updates?.updatedColumns,
        updatedCells: response.data.updates?.updatedCells,
      }),
    );
  } catch (error) {
    console.error("[Google Sheets] Append failed:", error);
    throw error;
  }
}

export async function formatOrderSheetLayout() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "T-shirt order";

  console.info("[Google Sheets] Formatting spreadsheet ID:", sheetId || "(missing)");
  console.info("[Google Sheets] Formatting tab:", tabName);

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    throw new Error(
      "Google Sheets credentials are missing. Add GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY.",
    );
  }

  const sheets = await createSheetsClient(serviceAccountEmail, privateKey);
  const numericSheetId = await ensureSheetExists(sheets, sheetId, tabName);
  const quotedTabName = quoteSheetName(tabName);

  await ensureHeaderRow(sheets, sheetId, quotedTabName);
  await safelyApplyPremiumSheetLayout(sheets, sheetId, tabName, numericSheetId);
}

async function ensureHeaderRow(
  sheets: SheetsClient,
  spreadsheetId: string,
  quotedTabName: string,
) {
  console.info("[Google Sheets] Checking header row:", `${quotedTabName}!A1:M1`);
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedTabName}!A1:M1`,
  });

  const existingHeader = existing.data.values?.[0];
  if (existingHeader?.length) {
    console.info("[Google Sheets] Header row exists:", JSON.stringify(existingHeader));
    return;
  }

  console.info("[Google Sheets] Header row missing. Writing headers.");
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quotedTabName}!A1:M1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [columns],
    },
  });
}

async function ensureSheetExists(
  sheets: SheetsClient,
  spreadsheetId: string,
  tabName: string,
): Promise<number | null> {
  console.info("[Google Sheets] Loading spreadsheet metadata.");
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const titles =
    spreadsheet.data.sheets
      ?.map((sheet) => sheet.properties?.title)
      .filter(Boolean) ?? [];
  console.info("[Google Sheets] Existing sheet tabs:", JSON.stringify(titles));
  const existingSheet = spreadsheet.data.sheets?.find(
    (sheet) => sheet.properties?.title === tabName,
  );

  const existingSheetId = existingSheet?.properties?.sheetId;
  if (typeof existingSheetId === "number") {
    console.info("[Google Sheets] Target tab exists:", tabName);
    return existingSheetId;
  }

  console.info("[Google Sheets] Target tab missing. Creating tab:", tabName);
  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: tabName,
            },
          },
        },
      ],
    },
  });
  console.info("[Google Sheets] Created tab:", tabName);

  const addedSheetId =
    response.data.replies?.[0]?.addSheet?.properties?.sheetId;

  if (typeof addedSheetId !== "number") {
    console.warn(
      `[Google Sheets] Tab was created but Google did not return a numeric sheet ID for ${tabName}. Layout formatting will be skipped.`,
    );
    return null;
  }

  return addedSheetId;
}

function quoteSheetName(tabName: string) {
  return `'${tabName.replace(/'/g, "''")}'`;
}

async function createSheetsClient(
  serviceAccountEmail: string,
  privateKey: string,
): Promise<SheetsClient> {
  const { google } = await import("googleapis");
  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth }) as unknown as SheetsClient;
}

async function applyPremiumSheetLayout(
  sheets: SheetsClient,
  spreadsheetId: string,
  sheetId: number,
) {
  console.info("[Google Sheets] Applying premium sheet layout to sheet ID:", sheetId);

  const requests: BatchUpdateRequest[] = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 1000,
            columnCount: columns.length,
          },
          tabColor: {
            red: 0.839,
            green: 0.635,
            blue: 0.227,
          },
        },
        fields: "gridProperties.frozenRowCount,gridProperties.rowCount,gridProperties.columnCount,tabColor",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: columns.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.027, green: 0.027, blue: 0.024 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
            textFormat: {
              foregroundColor: { red: 1, green: 0.961, blue: 0.839 },
              bold: true,
              fontSize: 11,
            },
          },
        },
        fields:
          "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 0,
          endColumnIndex: columns.length,
        },
        cell: {
          userEnteredFormat: {
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
            textFormat: {
              foregroundColor: { red: 0.098, green: 0.078, blue: 0.063 },
              fontSize: 10,
            },
          },
        },
        fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 7,
          endColumnIndex: 10,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat.horizontalAlignment",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 8,
          endColumnIndex: 10,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: {
              type: "CURRENCY",
              pattern: '"Rs." #,##0',
            },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    {
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 11,
          endColumnIndex: 12,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: orderStatusOptions.map((status) => ({ userEnteredValue: status })),
          },
          inputMessage: "Select current order status",
          strict: true,
          showCustomUi: true,
        },
      },
    },
    {
      setBasicFilter: {
        filter: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1000,
            startColumnIndex: 0,
            endColumnIndex: columns.length,
          },
        },
      },
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex: 0,
          endIndex: 1,
        },
        properties: { pixelSize: 42 },
        fields: "pixelSize",
      },
    },
    ...columnWidths(sheetId),
  ];

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });

  console.info(
    "[Google Sheets] Premium layout response:",
    JSON.stringify({ replies: response.data.replies?.length ?? 0 }),
  );
}

async function safelyApplyPremiumSheetLayout(
  sheets: SheetsClient,
  spreadsheetId: string,
  tabName: string,
  sheetId: number | null,
) {
  if (typeof sheetId !== "number") {
    console.warn(
      `[Google Sheets] Skipping premium layout because no numeric sheet ID was available for tab: ${tabName}`,
    );
    return;
  }

  try {
    await applyPremiumSheetLayout(sheets, spreadsheetId, sheetId);
  } catch (error) {
    console.warn(
      `[Google Sheets] Premium layout failed for tab ${tabName}, but order saving will continue.`,
      error,
    );
  }
}

function columnWidths(sheetId: number): BatchUpdateRequest[] {
  const widths = [170, 160, 180, 150, 220, 280, 270, 95, 135, 135, 180, 170, 240];

  return widths.map((width, index) => ({
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: "COLUMNS",
        startIndex: index,
        endIndex: index + 1,
      },
      properties: { pixelSize: width },
      fields: "pixelSize",
    },
  }));
}
