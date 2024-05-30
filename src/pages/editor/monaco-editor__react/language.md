
CompletionItem {
    /**
    * 该完成项目的标签
    * 默认情况下也是选择时插入的文本
    * 该完成项目的标签
    */
    label: string | CompletionItemLabel;
    /**
    * 该完成项目的种类图标。根据种类图标由编辑器选择。
    */
    kind: CompletionItemKind;
    /**
    * “kind”的修饰符，影响项目的渲染方式，例如已弃用以删除线呈现
    */
    tags?: ReadonlyArray<CompletionItemTag>;
    /**
    * 可读的字符串，其中包含有关此项目的附加信息，例如类型或符号信息
    */
    detail?: string;
    /**
    * 表示文档注释的可读字符串
    */
    documentation?: string | IMarkdownString;
    /**
    * 将此项目与其他项目进行比较时应使用的字符串。
    * 当“falsy”时，使用{@link CompletionItem.label label}
    */
    sortText?: string;
    /**
    * 过滤一组完成项时应使用的字符串。
    * 当“falsy”时，使用{@link CompletionItem.label label}
    */
    filterText?: string;
    /**
    * 显示时选择此项。 
    * 注意: 只能选择一个完成项目，由编辑者决定选择哪一个项目。规则是选择最匹配的*第一个*项目
    */
    preselect?: boolean;
    /**
    * 选择完成时应插入文档中的字符串或片段
    */
    insertText: string;
    /**
    * 插入此完成时应应用的附加规则（作为位掩码）
    */
    insertTextRules?: CompletionItemInsertTextRule;
    /**
    * 应由此完成项替换的文本范围。
    * 默认为从 {@link TextDocument.getWordRangeAtPosition 当前单词} 的开头到当前位置
    *
    * *Note:* 该范围必须是{@link Range.isSingleLine 单行}，并且必须{@link Range.contains 包含}已{@link
    *         CompletionItemProvider.provideCompletionItems 请求}完成的位置
    */
    range: IRange | CompletionItemRanges;
    /**
    * 一组可选字符，当此完成处于活动状态时按下时，将首先接受它，然后键入该字符。 
    * 注意: 所有提交字符都应具有“length=1”，并且多余的字符将被忽略
    */
    commitCharacters?: string[];
    /**
    * 选择此完成时应用的附加文本编辑的可选数组。
    * 编辑不得与主编辑重叠，也不得与其自身重叠
    */
    additionalTextEdits?: editor.ISingleEditOperation[];
    /**
    * 接受此项后应运行的命令
    */
    command?: Command;
}
