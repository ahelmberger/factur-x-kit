import { PDFFont, PDFPage, rgb } from 'pdf-lib';

import { mmToPt } from '../../types';
import { getNumberOfLines, wrapText } from '../helpers';

export interface TableSchemeType<T> {
    colWeight: number;
    colHeader: string;
    colContent: (data: T) => string;
    colAlignment: 'left' | 'right' | 'center';
}

type TableData<T> = T[];

export interface TableCommentType<T> {
    heading: string;
    content: (data: T) => string;
}

export interface TableInformation {
    width: number;
    height: number;
    startX: number;
    startY: number;
    columns: number;
    columnsWidth: number[];
    rows: number;
    padding: number;
}

// TODO: Ugly Spaghetti-Code. To be refactored

export default async function drawTable<T extends object>(
    page: PDFPage,
    data: TableData<T>,
    tableScheme: TableSchemeType<T>[],
    startX: number,
    startY: number,
    font: PDFFont,
    fontBold: PDFFont,
    options: {
        fontSize?: number;
        fontColor?: ReturnType<typeof rgb>;
        borderColor?: ReturnType<typeof rgb>;
        fillColorHeader?: ReturnType<typeof rgb>;
        fillColorRowEven?: ReturnType<typeof rgb>;
        fillColorRowOdd?: ReturnType<typeof rgb>;
        padding?: number;
        totalTableWidth?: number;
        commentScheme?: TableCommentType<T>[];
    } = {}
): Promise<[number, TableInformation]> {
    const {
        fontSize = 8,
        fontColor = rgb(0, 0, 0),
        borderColor = rgb(0.7, 0.7, 0.7),
        fillColorHeader = rgb(0.9, 0.9, 0.9),
        fillColorRowEven = rgb(1, 1, 1),
        fillColorRowOdd = rgb(0.97, 0.97, 0.97),
        padding = 5,
        totalTableWidth = page.getWidth() - startX - 15 * mmToPt
    } = options;

    let currentY = startY;

    const totalRelativeWidth = tableScheme.reduce((sum, col) => sum + col.colWeight, 0);
    const firstColumnWidth = ((tableScheme[0].colWeight || 1) / totalRelativeWidth) * totalTableWidth;
    const commentTitleColumnWidth = (totalTableWidth - firstColumnWidth) / 4;
    const commentTextWidth = totalTableWidth - 2 * padding - firstColumnWidth - commentTitleColumnWidth;
    const commentTextStartX = startX + padding + firstColumnWidth + commentTitleColumnWidth;
    const commentTitleStartX = startX + padding + firstColumnWidth;
    // Draw Header
    let currentX = startX;
    let headerHeight = fontSize + padding * 2;

    const returnTableInformation: TableInformation = {
        width: totalTableWidth,
        height: 0,
        startX: startX,
        startY: startY,
        columns: tableScheme.length,
        columnsWidth: [],
        rows: data.length,
        padding: padding
    };

    for (const col of tableScheme) {
        const actualColWidth = (col.colWeight / totalRelativeWidth) * totalTableWidth;
        returnTableInformation.columnsWidth.push(actualColWidth);
        const colContentntWidth = actualColWidth - 2 * padding;
        const numbersOfLines = getNumberOfLines(col.colHeader, fontSize, fontBold, colContentntWidth);
        const heightOfCell = numbersOfLines * fontSize + 2 * padding;
        if (heightOfCell > headerHeight) headerHeight = heightOfCell;
    }

    page.drawRectangle({
        x: startX,
        y: currentY - headerHeight,
        width: totalTableWidth,
        height: headerHeight,
        color: fillColorHeader,
        borderColor: borderColor,
        borderWidth: 0.5
    });

    for (const col of tableScheme) {
        const actualColWidth = (col.colWeight / totalRelativeWidth) * totalTableWidth;
        const colContentWidth = actualColWidth - 2 * padding;

        const wrappedText = wrapText(col.colHeader, fontSize, fontBold, colContentWidth);

        wrappedText.forEach((line, index) => {
            page.drawText(line, {
                x: getXPositionOfText(col.colAlignment, currentX, actualColWidth, padding, line, fontBold, fontSize),
                y: currentY - fontSize - padding - fontSize * index,
                font: fontBold,
                size: fontSize,
                color: fontColor,
                lineHeight: fontSize,
                maxWidth: colContentWidth
            });
        });
        currentX += actualColWidth;
    }

    currentY -= headerHeight;

    // Draw Content
    for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        currentX = startX;
        const isEvenRow = i % 2 === 0;
        const rowFillColor = isEvenRow ? fillColorRowEven : fillColorRowOdd;
        let rowHeight = fontSize + padding * 2;

        for (const col of tableScheme) {
            const actualColWidth = (col.colWeight / totalRelativeWidth) * totalTableWidth;
            const colContentWidth = actualColWidth - 2 * padding;
            const heightOfCell =
                getNumberOfLines(col.colContent(rowData), fontSize, font, colContentWidth) * fontSize + 2 * padding;
            if (heightOfCell > rowHeight) rowHeight = heightOfCell;
        }

        let commentHeight = 0;

        if (options.commentScheme) {
            for (const comm of options.commentScheme) {
                if (comm.content(rowData)) {
                    commentHeight =
                        commentHeight +
                        padding +
                        fontSize * getNumberOfLines(comm.content(rowData), fontSize, font, commentTextWidth);
                }
            }
            if (commentHeight > 0) commentHeight = commentHeight + padding;
        }

        page.drawRectangle({
            x: startX,
            y: currentY - rowHeight - commentHeight,
            width: totalTableWidth,
            height: rowHeight + commentHeight,
            color: rowFillColor,
            borderColor: borderColor,
            borderWidth: 0.5
        });

        if (commentHeight > 0)
            page.drawLine({
                start: { x: startX + padding + firstColumnWidth, y: currentY - rowHeight },
                end: { x: startX + totalTableWidth - padding, y: currentY - rowHeight },
                thickness: 0.25,
                color: borderColor
            });

        for (const col of tableScheme) {
            const actualColWidth = (col.colWeight / totalRelativeWidth) * totalTableWidth;
            const content = col.colContent(rowData);
            const colContentWidth = actualColWidth - 2 * padding;
            const wrappedText = wrapText(content, fontSize, font, colContentWidth);

            wrappedText.forEach((line, index) => {
                page.drawText(line, {
                    x: getXPositionOfText(col.colAlignment, currentX, actualColWidth, padding, line, font, fontSize),
                    y: currentY - fontSize - padding - fontSize * index,
                    font,
                    size: fontSize,
                    color: fontColor,
                    lineHeight: fontSize
                });
            });

            currentX += actualColWidth;
        }
        if (options.commentScheme) {
            let currentCommentY = currentY - rowHeight - padding - fontSize;
            for (const comm of options.commentScheme) {
                if (comm.content(rowData)) {
                    const headingText = `${comm.heading}:`;
                    // const headingTextWidth = fontBold.widthOfTextAtSize(headingText, fontSize)
                    // const headingTextStartX = commentTextStartX - padding - headingTextWidth
                    page.drawText(headingText, {
                        x: commentTitleStartX,
                        y: currentCommentY,
                        font: fontBold,
                        size: fontSize,
                        color: fontColor,
                        lineHeight: fontSize
                    });

                    page.drawText(comm.content(rowData), {
                        x: commentTextStartX,
                        y: currentCommentY,
                        font,
                        size: fontSize,
                        color: fontColor,
                        lineHeight: fontSize,
                        maxWidth: commentTextWidth
                    });

                    currentCommentY =
                        currentCommentY -
                        padding -
                        fontSize * getNumberOfLines(comm.content(rowData), fontSize, font, commentTextWidth);
                }
            }
        }

        currentY -= rowHeight + commentHeight;
    }

    return [currentY, returnTableInformation];
}

function getXPositionOfText(
    colAlignment: 'left' | 'right' | 'center',
    currentX: number,
    actualColWidth: number,
    padding: number,
    content: string,
    font: PDFFont,
    fontSize: number
): number {
    if (colAlignment === 'left') {
        return currentX + padding;
    }
    const textWidth = font.widthOfTextAtSize(content, fontSize);
    if (colAlignment === 'right') {
        return currentX + actualColWidth - textWidth - padding;
    }
    if (colAlignment === 'center') {
        return currentX + (actualColWidth - textWidth) / 2;
    }
    return currentX + padding; // Default to left alignment if no valid alignment is provided
}
