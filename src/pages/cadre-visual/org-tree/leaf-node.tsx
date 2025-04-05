import {isEmpty} from 'lodash-es';
import {Avatar} from 'antd';
import cx from 'classnames';
import {OrgTreeVO} from 'src/components/bi-tree/types';
import {BooleanFlag} from 'src/constants';
import SvgIcon from 'src/components/svg-icon';
import {calculateOpacityColor} from 'src/utils/css/calc-shadow-color';
import avatarJpg from 'src/assets/avatar.jpeg?url';


export const renderNode = (data: OrgTreeVO & {showPosition: boolean}) => {
    const {
        orgName,
        chiefName,
        // image,
        permissionFlag,
        locationName,
        personCount,
        positionResultName,
        positionResultColor,
        positionResultList,
        orgTreeTagList,
        mainFlag,
        showPosition,
    } = data || {};
    // 无权
    const isLocked = permissionFlag === BooleanFlag.False;

    return (
        <div className="tree-node-container">
            {
                positionResultName ? (
                    <div
                        className="position-result-tag"
                        style={{backgroundColor: positionResultColor || undefined}}
                    >{positionResultName}</div>
                ) : null
            }
            <div className={cx('content-top', {
                'no-permission-content': isLocked,
            })}>
                <div className="content-org-name">{orgName || '--'}</div>
                {
                    isLocked ? (
                        <div className="no-permission">暂无权限</div>
                    ) : (
                        <div className="content-org-info">
                            <div className="leader-info">
                                <Avatar
                                    src={avatarJpg}
                                    size={'small'}
                                    alt={orgName}
                                    draggable={false}
                                />
                                <span className="leader-name">
                                    {chiefName || '--'}{mainFlag === BooleanFlag.False ? '（兼）' : ''}
                                </span>
                            </div>
                            {locationName ? <div className="location-info">{locationName}</div> : null}
                            <div className="group-size">团队规模：{personCount ?? '--'}人</div>

                        </div>
                    )
                }
            </div>
            <div className={cx('content-bottom', {
                'hidden-content': !showPosition && !isLocked && isEmpty(orgTreeTagList),
            })}>
                {isLocked ? (
                    <div className="locked-content">
                        <SvgIcon name="lock" />
                    </div>
                ) : (
                    <div className="position-detail-container">
                        <div className="org-tree-tag-container">
                            {
                                orgTreeTagList?.map((item, index) => {
                                    const {
                                        /** tag名称 */
                                        orgTreeTagName,
                                        orgTreeTagCode,
                                    } = item || {};

                                    return (
                                        <span key={orgTreeTagCode} title={orgTreeTagName}>{orgTreeTagName}</span>
                                    );
                                })
                            }
                        </div>
                        {
                            showPosition && !isEmpty(positionResultList) && (
                                <>
                                    <div className="position-result-title">下级组织岗位适配度汇总</div>
                                    <div className="position-result-list">
                                        {
                                            positionResultList?.map((item, index) => {
                                                const {
                                                    /** 组织数 */
                                                    orgCount,
                                                    /** 适配度结果color */
                                                    positionResultColor,
                                                    /** 适配度结果name */
                                                    positionResultName,
                                                } = item || {};
                                                const bgColor = calculateOpacityColor(positionResultColor, 0.18);

                                                return (
                                                    <div
                                                        className="position-result-item"
                                                        style={{
                                                            backgroundColor: bgColor,
                                                        }}
                                                        key={index}
                                                    >
                                                        <div className="org-count">{orgCount}</div>
                                                        <div className="position-result-name">{positionResultName}</div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    );
};
