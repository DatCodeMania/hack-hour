import { View } from "@slack/bolt";
import { prisma } from "../../lib/prisma.js";

export const Actions = {
    GOAL_COMPLETE: 'goal_complete'
}

export const Callbacks = {
    COMPLETE_GOAL: 'goal_complete'
}

export class Ship {
    public static async completeModal(userId: string): Promise<View> {
        const goals = await prisma.goal.findMany({
            where: {
                userId,
                completed: false,
                NOT: {
                    name: "No Goal"
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        if (goals.length === 0) {
            return {
                "type": "modal",
                "title": {
                    "type": "plain_text",
                    "text": "Complete Goal",
                    "emoji": true
                },
                "close": {
                    "type": "plain_text",
                    "text": "Close",
                    "emoji": true
                },
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "You have no goals to complete"
                        }
                    }
                ]
            };
        }

        const selectedGoal = goals.find(goal => goal.selected);

        const goalsInput = {
            "type": "input",
            "elements": [
                {
                    "type": "radio_buttons",
                    "initial_option": selectedGoal ? {
                        "text": {
                            "type": "plain_text",
                            "text": selectedGoal.name,
                            "emoji": true
                        },
                        "value": selectedGoal.id
                    } : undefined,
                    "options": goals.map(goal => {
                        return {
                            "text": {
                                "type": "plain_text",
                                "text": goal.name,
                                "emoji": true
                            },
                            "value": goal.id
                        }
                    })
                }
            ]
        };

        return {
            "type": "modal",
            "callback_id": Callbacks.COMPLETE_GOAL,
            "title": {
                "type": "plain_text",
                "text": "Complete Goal",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Complete",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Select a goal to complete"
                    }
                },
                goalsInput 
            ]
        };
    }
}