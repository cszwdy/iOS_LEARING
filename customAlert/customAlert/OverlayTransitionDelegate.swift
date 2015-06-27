//
//  OverlayTransitionDelegate.swift
//  customAlert
//
//  Created by Emiaostein on 6/25/15.
//  Copyright (c) 2015 botai. All rights reserved.
//

import Foundation
import UIKit

class OverlaytransitioningDelegate:NSObject, UIViewControllerTransitioningDelegate {
    
    func animationControllerForPresentedController(presented: UIViewController, presentingController presenting: UIViewController, sourceController source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        
        let animaiton = OverlayAnimatedTransitioning()
        animaiton.dismiss = false
        return animaiton
    }

    func animationControllerForDismissedController(dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        
        let animaiton = OverlayAnimatedTransitioning()
        animaiton.dismiss = true
        return animaiton
    }
//
//    optional func interactionControllerForPresentation(animator: UIViewControllerAnimatedTransitioning) -> UIViewControllerInteractiveTransitioning?
//    
//    optional func interactionControllerForDismissal(animator: UIViewControllerAnimatedTransitioning) -> UIViewControllerInteractiveTransitioning?
    
    @availability(iOS, introduced=8.0)
    func presentationControllerForPresentedViewController(presented: UIViewController, presentingViewController presenting: UIViewController!, sourceViewController source: UIViewController) -> UIPresentationController? {
        
        return OverlayPresentationController(presentedViewController: presented, presentingViewController: presenting)
    }
    
}